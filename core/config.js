window.V1000_CONFIG={


version:"DLT AI CORE V1000 FINAL",


dataFile:"data/dlt.txt",



simulation:{


monteCarlo:1000000,


trainingMode:"fast",


analysisMode:"full"


},




windows:{


trend:50,


training:500,


backtest:[100,500,1000]


},




weights:{


frequency:0.12,


trend:0.15,


missing:0.12,


bayes:0.15,


markov:0.12,


matrix:0.10,


rhythm:0.10,


theory:0.07,


antiHuman:0.07



}



};