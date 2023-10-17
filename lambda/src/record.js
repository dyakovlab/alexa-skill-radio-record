const https = require('https');

class Record {
  constructor() {
    this.stationsUrl = 'https://www.radiorecord.ru/api/stations/';
    this.baseStation = 'record';
    this.stations = [];
  }

  async getStations() {
    return new Promise((resolve, reject) => {
      const req = https.get(this.stationsUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        });
      });
      req.on('error', (error) => {
        reject(error);
      });
      req.end();
    });
  }

  async getStationDataByName(stationRequest) {
    const stationName = stationRequest.toString().toLowerCase();
    const result = {
      voice: `Sorry. I can't find ${(stationName !== 'undefined') ? stationName : 'this'} station. Please try again.`,
      url: null,
      metadata: null
    }

    const stationsData = await this.getStations();
    if (stationsData && stationsData.result && stationsData.result.stations) {
      this.stations = stationsData.result.stations;
      const station = this.stations.find(s => s.title.toLowerCase().includes(stationName))
      if (station) {
        result.voice = `Playing ${stationName} on Radio Record`
        result.url = station.stream_hls
        result.metadata = {
          title: station.title,
          subtitle: station.tooltip,
          art: {
            sources: [
              {
                url: station.icon_fill_colored,
              },
            ],
          },
          backgroundImage: {
            sources: [
              {
                url: station.bg_image,
              },
            ],
          },
        }
      }
    }

    return result
  }
}

module.exports = Record;