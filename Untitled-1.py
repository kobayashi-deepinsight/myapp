

import os

os.makedirs("music", exist_ok=True)

for n in range(10):
    dir = os.path.join("music", F"dir_{n}")
    os.makedirs(dir, exist_ok=True)
    for m in range(10):
        filename = os.path.join(dir, F"file_{n}_{m}")
        f = open(filename, 'w')
        f.write(filename)
        f.close()
