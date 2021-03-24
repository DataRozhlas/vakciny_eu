(function () {
    const population = 441100; // lidi 80+ dle ČSÚ
    Promise.all([
      fetch('https://data.irozhlas.cz/covid-uzis/osoby5.json'), // nakažení v řletých intervalech
      fetch('https://data.irozhlas.cz/covid-uzis/vak_vek_prvni.json'), // vakcinovaní první dávkou
    ]).then((resps) => Promise.all(resps.map((resp) => resp.json()))).then((d) => {
      const infected = d[0];
      const vaccinated = d[1];
      // nakažení za 21 dní včetně
      const inf_srs = [];
      infected.forEach((rec, i) => {
        if (i >= 21) {
          const threeWeeks = infected.slice(i - 21, i);
          let suma = 0;
          threeWeeks.forEach((r) => { suma += r['80+']; });
          inf_srs.push([
            Date.parse(rec.ind),
            Math.round((suma / population) * 100000) / 10, // v populaci na 10 tis.
          ]);
        }
      });
  
      // vakcinovaní 80+ celkem
      const vacc_srs = [];
      let vsum = 0;
      vaccinated.forEach((rec) => {
        vsum += rec['80+'];
        vacc_srs.push([
          Date.parse(rec.ind),
          Math.round((vsum / population) * 1000) / 10, // v %
        ]);
      });
  
      Highcharts.setOptions({
        lang: {
          numericSymbols: [' tis.', ' mil.'],
          weekdays: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
          shortMonths: ['led.', 'úno.', 'bře.', 'dub.', 'kvě.', 'čvn.', 'čvc.', 'srp.', 'zář.', 'říj.', 'lis.', 'pro.'],
        },
      });
  
      Highcharts.chart('cvd-vak-inc-80', {
        chart: {
          type: 'line',
          spacingLeft: 0,
          spacingRight: 0,
        },
        credits: {
          href: 'https://onemocneni-aktualne.mzcr.cz/vakcinace-cr',
          text: 'Zdroj dat: ÚZIS',
        },
        title: {
          text: 'Očkovaní a nakažení ve věku 80+',
          align: 'left',
          style: {
            fontWeight: 'bold',
          },
        },
        subtitle: {
          text: `Aktualizováno ${Highcharts.dateFormat('%d. %m.', vacc_srs.slice(-1)[0][0])}`,
          align: 'left',
          useHTML: true,
        },
        xAxis: {
          type: 'datetime',
        },
        yAxis: [{
          labels: {
            format: '{value}',
            style: {
              color: '#de2d26',
            },
          },
          title: {
            text: 'nakažených na 10 tis.',
            style: {
              color: '#de2d26',
            },
          },
          max: 300,
        }, {
          title: {
            text: 'očkovaných',
            style: {
              color: '#756bb1',
            },
          },
          labels: {
            format: '{value} %',
            style: {
              color: '#756bb1',
            },
          },
          opposite: true,
          max: 100,
        }],
        tooltip: {
          shared: true,
          formatter() {
            const p = this.points;
            let pct = 0;
            if (p[1]) { pct = p[1].y; }
            return `${Highcharts.dateFormat('%d. %m. %y', p[0].x)}<br>nakažení: ${p[0].y} na 10 tis.<br>očkovaní: ${pct} %`;
          },
        },
        plotOptions: {
          series: {
            animation: false,
          },
          line: {
            marker: {
              enabled: false,
            },
          },
        },
        series: [{
          name: 'nakažení za 21 dní',
          data: inf_srs.filter((r) => r[0] >= Date.parse('2020-09-01')),
          color: '#de2d26',
        }, {
          name: 'očkovaní',
          data: vacc_srs,
          yAxis: 1,
          color: '#756bb1',
        }],
      });
    });
  }());
  