# Setup

- creare nella root del progetto il file `credentials.json` contenente le seguenti chiavi:
```
{
  "accessKeyId": "...",
  "secretAccessKey": "..."
}
```

- eseguire `npm install` e `node .` per eseguire l'applicativo

eseguire il file di input 0 con node
```
node . 0 -p="node process/process.js"
```

eseguire il file di input 0 con python
```
node . 0 -p="python process/process.py"
```