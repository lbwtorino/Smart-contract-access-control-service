// Copyright 2014 The go-ethereum Authors
// This file is part of the go-ethereum library.
//
// The go-ethereum library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The go-ethereum library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the go-ethereum library. If not, see <http://www.gnu.org/licenses/>.

package vm

import (
	"fmt"
	"math/big"
	"sync/atomic"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/logger"
	"github.com/ethereum/go-ethereum/logger/glog"
	"github.com/ethereum/go-ethereum/params"
)

// Config are the configuration options for the Interpreter
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// EnableJit enabled the JIT VM
	EnableJit bool
	// ForceJit forces the JIT VM
	ForceJit bool
	// Tracer is the op code logger
	Tracer Tracer
	// NoRecursion disabled Interpreter call, callcode,
	// delegate call and create.
	NoRecursion bool
	// Disable gas metering
	DisableGasMetering bool
	// Enable recording of SHA3/keccak preimages
	EnablePreimageRecording bool
	// JumpTable contains the EVM instruction table. This
	// may me left uninitialised and will be set the default
	// table.
	JumpTable [256]operation
}

// Interpreter is used to run Ethereum based contracts and will utilise the
// passed environment to query external sources for state information.
// The Interpreter will run the byte code VM or JIT VM based on the passed
// configuration.
type Interpreter struct {
	env      *EVM
	cfg      Config
	gasTable params.GasTable
}

// NewInterpreter returns a new instance of the Interpreter.
func NewInterpreter(env *EVM, cfg Config) *Interpreter {
	// We use the STOP instruction whether to see
	// the jump table was initialised. If it was not
	// we'll set the default jump table.
	if !cfg.JumpTable[STOP].valid {
		cfg.JumpTable = defaultJumpTable
	}

	return &Interpreter{
		env:      env,
		cfg:      cfg,
		gasTable: env.ChainConfig().GasTable(env.BlockNumber),
	}
}

// Run loops and evaluates the contract's code with the given input data
func (evm *Interpreter) Run(contract *Contract, input []byte) (ret []byte, err error) {
	// SHELLY START
	TheChecker().UponEVMStart(evm, contract)
	// SHELLY END

	evm.env.depth++
	defer func() { evm.env.depth-- }()

	// SHELLY START
	defer TheChecker().UponEVMEnd(evm, contract)
	// SHELLY END

	if contract.CodeAddr != nil {
		if p := PrecompiledContracts[*contract.CodeAddr]; p != nil {
			return RunPrecompiledContract(p, input, contract)
		}
	}

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	codehash := contract.CodeHash // codehash is used when doing jump dest caching
	if codehash == (common.Hash{}) {
		codehash = crypto.Keccak256Hash(contract.Code)
	}

	var (
		op    OpCode        // current opcode
		mem   = NewMemory() // bound memory
		stack = newstack()  // local stack
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go above 2^64. The YP defines the PC to be uint256. Practically much less so feasible.
		pc   = uint64(0) // program counter
		cost *big.Int
	)
	contract.Input = input

	// User defer pattern to check for an error and, based on the error being nil or not, use all gas and return.
	defer func() {
		if err != nil && evm.cfg.Debug {
			evm.cfg.Tracer.CaptureState(evm.env, pc, op, contract.Gas, cost, mem, stack, contract, evm.env.depth, err)
		}
	}()

	if glog.V(logger.Debug) {
		glog.Infof("evm running: %x\n", codehash[:4])
		tstart := time.Now()
		defer func() {
			glog.Infof("evm done: %x. time: %v\n", codehash[:4], time.Since(tstart))
		}()
	}

	// The Interpreter main run loop (contextual). This loop runs until either an
	// explicit STOP, RETURN or SELFDESTRUCT is executed, an error occurred during
	// the execution of one of the operations or until the evm.done is set by
	// the parent context.Context.
	for atomic.LoadInt32(&evm.env.abort) == 0 {
		// Get the memory location of pc
		op = contract.GetOp(pc)

		// get the operation from the jump table matching the opcode
		operation := evm.cfg.JumpTable[op]

		// SHELLY START
		//fmt.Printf("Running operation op %v\n", op)
		// SHELLY END

		// if the op is invalid abort the process and return an error
		if !operation.valid {

			return nil, fmt.Errorf("invalid opcode %x", op)
		}

		// validate the stack and make sure there enough stack items available
		// to perform the operation
		if err := operation.validateStack(stack); err != nil {
			// SHELLY: Stack exception - updated in makeStackFunc
			return nil, err
		}

		var memorySize *big.Int
		// calculate the new memory size and expand the memory to fit
		// the operation
		if operation.memorySize != nil {
			memorySize = operation.memorySize(stack)
			// memory is expanded in words of 32 bytes. Gas
			// is also calculated in words.
			memorySize.Mul(toWordSize(memorySize), big.NewInt(32))
		}

		if !evm.cfg.DisableGasMetering {
			// consume the gas and return an error if not enough gas is available.
			// cost is explicitly set so that the capture state defer method cas get the proper cost
			cost = operation.gasCost(evm.gasTable, evm.env, contract, stack, mem, memorySize)
			if !contract.UseGas(cost) {

				return nil, ErrOutOfGas
			}
		}
		if memorySize != nil {
			mem.Resize(memorySize.Uint64())
		}

		if evm.cfg.Debug {
			evm.cfg.Tracer.CaptureState(evm.env, pc, op, contract.Gas, cost, mem, stack, contract, evm.env.depth, err)
		}

		// execute the operation
		res, err := operation.execute(&pc, evm.env, contract, mem, stack)
		switch {
		case err != nil:

			return nil, err
		case operation.halts:
			return res, nil
		case !operation.jumps:
			pc++
		}
	}
	return nil, nil
}
