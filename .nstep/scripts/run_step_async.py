import subprocess
import sys

step = sys.argv[1]

command = f'cd {step} && npm start'

subprocess.Popen(command, shell=True)

# Path: .nstep\scripts\run_step.py