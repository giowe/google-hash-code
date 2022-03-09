# Soluzioni Futura

## Setup

- creare nella root del progetto il file `credentials.json` contenente le seguenti chiavi:

``` JSON
{
  "accessKeyId": "...",
  "secretAccessKey": "..."
}
```

- eseguire `npm install` e `node .` per eseguire l'applicativo

- verificare che il `.env` sia correttamente configurato con le seguenti chiavi
  - `S3_BUCKET`: bucket di s3 su cui vengono caricati i risultati delle prove
  - `MAIN_PROCESS`: ad esempio `node ./process/process.js`; determina quale processo debba essere utilizzato per elaborare i dati di input e salvare i dati di output. Questo approccio consente di sviluppare la parte centrale del problema in un qualsiasi linguaggio di programmazione. Il file `main.js` spwna un subprocess del sistema operativo che esegue il `MAIN_PROCESS` passandogli il path dei dati di input e il path in cui salvere i dati di output.

## Commands

- `npm run sample`: esegue lo scorer utilizzando come input e output file i sample inseriti manualmente nella cartella `./src/samples`; questo script e' utile nella prima fase della gara in cui un membro del team deve potersi dedicare immediatamente allo sviluppo dello scorer.

- `npm run validateParser`: esegue il main process importando il primo dataset e validandolo con `/samples/input.js`; questo script e' utile nella prima fase della gara per perfezionare lo scorer

