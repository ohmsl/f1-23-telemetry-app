// Team IDs
// ID Team ID Team ID Team
// 0 Mercedes 106 Prema ‘21 136 Campos ‘22
// 1 Ferrari 107 Uni-Virtuosi ‘21 137 Van Amersfoort Racing ‘22
// 2 Red Bull Racing 108 Carlin ‘21 138 Trident ‘22
// 3 Williams 109 Hitech ‘21 139 Hitech ‘22
// 4 Aston Martin 110 Art GP ‘21 140 Art GP ‘22
// 5 Alpine 111 MP Motorsport ‘21
// 6 Alpha Tauri 112 Charouz ‘21
// 7 Haas 113 Dams ‘21
// 8 McLaren 114 Campos ‘21
// 9 Alfa Romeo 115 BWT ‘21
// 85 Mercedes 2020 116 Trident ‘21
// 86 Ferrari 2020 117 Mercedes AMG GT Black
// Series
// 87 Red Bull 2020 118 Mercedes ‘22
// 88 Williams 2020 119 Ferrari ‘22
// 89 Racing Point 2020 120 Red Bull Racing ‘22
// 90 Renault 2020 121 Williams ‘22
// 91 Alpha Tauri 2020 122 Aston Martin ‘22
// 92 Haas 2020 123 Alpine ‘22
// 93 McLaren 2020 124 Alpha Tauri ‘22
// 94 Alfa Romeo 2020 125 Haas ‘22
// 95 Aston Martin DB11 V12 126 McLaren ‘22
// 96 Aston Martin Vantage F1
// Edition 127 Alfa Romeo ‘22
// 97 Aston Martin Vantage
// Safety Car 128 Konnersport ‘22
// 98 Ferrari F8 Tributo 129 Konnersport
// 99 Ferrari Roma 130 Prema ‘22
// 100 McLaren 720S 131 Virtuosi ‘22
// 101 McLaren Artura 132 Carlin ‘22
// 102 Mercedes AMG GT Black
// Series Safety Car 133 MP Motorsport ‘22
// 103 Mercedes AMG GTR Pro 134 Charouz ‘22
// 104 F1 Custom Team 135 Dams ‘22

const getTeam = (teamId: number) => {
  switch (teamId) {
    case 0:
      return "Mercedes";
    case 1:
      return "Ferrari";
    case 2:
      return "Red Bull Racing";
    case 3:
      return "Williams";
    case 4:
      return "Aston Martin";
    case 5:
      return "Alpine";
    case 6:
      return "Alpha Tauri";
    case 7:
      return "Haas";
    case 8:
      return "McLaren";
    case 9:
      return "Alfa Romeo";
    case 85:
      return "Mercedes 2020";
    case 86:
      return "Ferrari 2020";
    case 87:
      return "Red Bull 2020";
    case 88:
      return "Williams 2020";
    case 89:
      return "Racing Point 2020";
    case 90:
      return "Renault 2020";
    case 91:
      return "Alpha Tauri 2020";
    case 92:
      return "Haas 2020";
    case 93:
      return "McLaren 2020";
    case 94:
      return "Alfa Romeo 2020";
    case 95:
      return "Aston Martin DB11 V12";
    case 96:
      return "Aston Martin Vantage F1 Edition";
    case 97:
      return "Aston Martin Vantage Safety Car";
    case 98:
      return "Ferrari F8 Tributo";
    case 99:
      return "Ferrari Roma";
    case 100:
      return "McLaren 720S";
    case 101:
      return "McLaren Artura";
    case 102:
      return "Mercedes AMG GT Black Series";
    case 103:
      return "Mercedes AMG GTR Pro";
    case 104:
      return "F1 Custom Team";
    case 106:
      return "Prema ‘21";
    case 107:
      return "Uni-Virtuosi ‘21";
    case 108:
      return "Carlin ‘21";
    case 109:
      return "Hitech ‘21";
    case 110:
      return "Art GP ‘21";
    case 111:
      return "MP Motorsport ‘21";
    case 112:
      return "Charouz ‘21";
    case 113:
      return "Dams ‘21";
    case 114:
      return "Campos ‘21";
    case 115:
      return "BWT ‘21";
    case 116:
      return "Trident ‘21";
    case 117:
      return "Mercedes AMG GT Black Series";
    case 118:
      return "Mercedes ‘22";
    case 119:
      return "Ferrari ‘22";
    case 120:
      return "Red Bull Racing ‘22";
    case 121:
      return "Williams ‘22";
    case 122:
      return "Aston Martin ‘22";
    case 123:
      return "Alpine ‘22";
    case 124:
      return "Alpha Tauri ‘22";
    case 125:
      return "Haas ‘22";
    case 126:
      return "McLaren ‘22";
    case 127:
      return "Alfa Romeo ‘22";
    case 128:
      return "Konnersport ‘22";
    case 129:
      return "Konnersport";
    case 130:
      return "Prema ‘22";
    case 131:
      return "Virtuosi ‘22";
    case 132:
      return "Carlin ‘22";
    case 133:
      return "MP Motorsport ‘22";
    case 134:
      return "Charouz ‘22";
    case 135:
      return "Dams ‘22";
    case 136:
      return "Campos ‘22";
    case 137:
      return "Van Amersfoort Racing ‘22";
    case 138:
      return "Trident ‘22";
    case 139:
      return "Hitech ‘22";
    case 140:
      return "Art GP ‘22";
    default:
      return "Unavailable";
  }
};

export default getTeam;
