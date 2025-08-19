import subprocess

def query_ollama(prompt, model="mistral"):
    cmd = ["ollama", "run", model]
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    output, _ = process.communicate(prompt)
    return output
