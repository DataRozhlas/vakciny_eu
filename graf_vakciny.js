(function () {
  fetch('https://data.irozhlas.cz/covid-uzis/ocko_owid.json')
    .then((response) => response.json())
    .then((data) => {
      const dataSeries = [];

      data.forEach((cntry) => dataSeries.push({
        name: cntry[0],
        data: cntry.slice(1).map((day) => [Date.parse(day[0]), day[1]]),
      }));

      Highcharts.setOptions({
        lang: {
          numericSymbols: [' tis.', ' mil.'],
          weekdays: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
          shortMonths: ['led.', 'úno.', 'bře.', 'dub.', 'kvě.', 'čvn.', 'čvc.', 'srp.', 'zář.', 'říj.', 'lis.', 'pro.'],
        },
      });

      Highcharts.chart('cvd-vak-eu', {
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
          text: `Aktualizováno ${Highcharts.dateFormat('%d. %m.', dataSeries[0].data.slice(-1)[0][0])}`,
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
        series: dataSeries,
      });
    });
}());
