var data = {
  "node": {
    "PR":{
      "size": 192,
      "image": 0,
      "layer": "L1",
      "x": 0,
      "y": 512+256,
      "from": null
    },
    "SC":{
      "size": 192,
      "image": 1,
      "layer": "L1",
      "x": 0,
      "y": -1024+256,
      "from": null
    },
    "PC":{
      "size": 192,
      "image": 2,
      "layer": "L1",
      "x": -1024+256,
      "y": 0,
      "from": null
    },
    "NT":{
      "size": 192,
      "image": 3,
      "layer": "L1",
      "x": 0+256,
      "y": 0,
      "from": null
    },
    "MD":{
      "size": 192,
      "image": 4,
      "layer": "L1",
      "x": -512+256,
      "y": 0,
      "from": null
    },
    "TL":{
      "size": 192,
      "image": 5,
      "layer": "L1",
      "x": 512+256,
      "y": 0,
      "from": null
    },
    "ST":{
      "size": 192,
      "image": 6,
      "layer": "L1",
      "x": 0,
      "y": 0,
      "from": null
    },
    "CP":{
      "size": 192,
      "image": 7,
      "layer": "L3",
      "x": 0,
      "y": 0,
      "from": "SC",
      "to": "PR"
    },
    "SP":{
      "size": 192,
      "image": 8,
      "layer": "L3",
      "x": -1024+256,
      "y": 0,
      "from": "ST",
      "to": "PR"
    },
    "PP":{
      "size": 192,
      "image": 9,
      "layer": "L3",
      "x": -1024+256,
      "y": 512+256,
      "from": "PC",
      "to": "PR"
    },
    "NP":{
      "size": 192,
      "image": 10,
      "layer": "L3",
      "x": 0+256,
      "y": 512+256,
      "from": "NT",
      "to": "PR"
    },
    "MP":{
      "size": 192,
      "image": 11,
      "layer": "L3",
      "x": -512+256,
      "y": 512+256,
      "from": "MD",
      "to": "PR"
    },
    "FP":{
      "size": 192,
      "image": 12,
      "layer": "L3",
      "x": 512+256,
      "y": 512+256,
      "from": "TL",
      "to": "PR"
    },
    "FF":{
      "size": 192,
      "image": 13,
      "layer": "L3",
      "x": 512+256,
      "y": 0,
      "from": "TL",
      "to": "NT"
    },
    "SF":{
      "size": 192,
      "image": 14,
      "layer": "L3",
      "x": 512+256,
      "y": -1024+256,
      "from": "SC",
      "to": "TL"
    },
    "S2M":{
      "size": 192,
      "image": 15,
      "layer": "L3",
      "x": -512+256,
      "y": -1024+256,
      "from": "SC",
      "to": "MD"
    },
    "S2E":{
      "size": 192,
      "image": 16,
      "layer": "L3",
      "x": 0+256,
      "y": -1024+256-192,
      "same": "S2N",
      "from": null
    },
    "S2N":{
      "size": 192,
      "image": 17,
      "layer": "L3",
      "x": 0+256,
      "y": -1024+256,
      "from": "SC",
      "to": "NT"
    },
    "S2P":{
      "size": 192,
      "image": 18,
      "layer": "L3",
      "x": -1024+256,
      "y": -1024+256,
      "from": "SC",
      "to": "PC"
    }
  }
}
