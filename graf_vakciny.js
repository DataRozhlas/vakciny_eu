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
          href: 'https://ourworldindata.org/grapher/covid-vaccination-doses-per-capita?country=DEU~POL~CZE~SVK~AUT',
          text: 'Zdroj dat: Our World in Data',
        },
        title: {
          text: 'Očkovaní proti covid-19 na 100 obyvatel',
          align: 'left',
          style: {
            fontWeight: 'bold',
          },
        },
        subtitle: {
          text: `Počet osob, které dostaly alespoň jednu dávku vakcíny. Aktualizováno ${Highcharts.dateFormat('%d. %m.', dataSeries[0].data.slice(-1)[0][0])}`,
          align: 'left',
          useHTML: true,
        },
        xAxis: {
          type: 'datetime',
        },
        yAxis: {
          title: {
            text: 'počet osob s alespoň první dávkou na 100 obyvatel',
          },
        },
        tooltip: {
          shared: true,
          formatter() {
            const p = this.points;
            let txt = '';
            p.forEach(cnt => {
              txt += `<span style='color: ${cnt.color};'>${cnt.series.name}: ${cnt.y}</span><br>`;
            });
            return `<b>${Highcharts.dateFormat('%d. %m. %y', p[0].x)}</b><br>celkem očkovaných na 100 obyvatel<br>${txt}`;
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
