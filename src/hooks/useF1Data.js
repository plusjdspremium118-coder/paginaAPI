/**
 * useF1Data.js — Datos reales F1 2024 (Ergast/Jolpica API)
 * Utiliza exclusivamente imágenes PNG sin fondo oficiales de la CDN de la F1.
 */
import { useState, useEffect } from 'react';

const BASE = 'https://api.jolpi.ca/ergast/f1';

// ── ASSETS OFICIALES 2024 (Imágenes sin fondo) ──────────────────────────
const TEAM_ASSETS = {
  'Red Bull': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/redbullracing/2026redbullracinglogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png'
  },
  'Ferrari': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/ferrari/2026ferrarilogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari.png'
  },
  'McLaren': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarenlogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png'
  },
  'Mercedes': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedeslogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes.png'
  },
  'Aston Martin': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/astonmartin/2026astonmartinlogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png'
  },
  'Alpine': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/alpine/2026alpinelogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/alpine.png'
  },
  'Williams': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/williams/2026williamslogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/williams.png'
  },
  'RB': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/racingbulls/2026racingbullslogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/rb.png'
  },
  'Sauber': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/audi/2026audilogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber.png'
  },
  'Haas': {
    logo: 'https://media.formula1.com/image/upload/q_auto/v1740000001/common/f1/2026/haasf1team/2026haasf1teamlogowhite.webp',
    car: 'https://media.formula1.com/content/dam/fom-website/teams/2024/haas-f1-team.png'
  }
};

const DRIVER_IMGS = {
  'verstappen': 'https://media.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
  'max_verstappen': 'https://media.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png',
  'perez': 'https://media.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png',
  'leclerc': 'https://media.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png',
  'sainz': 'https://media.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png',
  'hamilton': 'https://media.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png',
  'russell': 'https://media.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png',
  'norris': 'https://media.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png',
  'piastri': 'https://media.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png',
  'alonso': 'https://media.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png',
  'stroll': 'https://media.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png',
  'gasly': 'https://media.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png',
  'ocon': 'https://media.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png',
  'albon': 'https://media.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png',
  'colapinto': 'https://media.formula1.com/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png',
  'sargeant': 'https://media.formula1.com/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png',
  'hulkenberg': 'https://media.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png',
  'magnussen': 'https://media.formula1.com/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png',
  'kevin_magnussen': 'https://media.formula1.com/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png',
  'bottas': 'https://media.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png',
  'zhou': 'https://media.formula1.com/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png',
  'tsunoda': 'https://media.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png',
  'ricciardo': 'https://media.formula1.com/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png',
  'lawson': 'https://media.formula1.com/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png',
  'bearman': 'https://media.formula1.com/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png'
};

const GP_ES = {
  'Australian Grand Prix':'Gran Premio de Australia','Chinese Grand Prix':'Gran Premio de China',
  'Japanese Grand Prix':'Gran Premio de Japón','Bahrain Grand Prix':'Gran Premio de Baréin',
  'Saudi Arabian Grand Prix':'Gran Premio de Arabia Saudita','Miami Grand Prix':'Gran Premio de Miami',
  'Emilia Romagna Grand Prix':'Gran Premio de Emilia Romaña','Monaco Grand Prix':'Gran Premio de Mónaco',
  'Canadian Grand Prix':'Gran Premio de Canadá','Spanish Grand Prix':'Gran Premio de España',
  'Austrian Grand Prix':'Gran Premio de Austria','British Grand Prix':'Gran Premio de Gran Bretaña',
  'Hungarian Grand Prix':'Gran Premio de Hungría','Belgian Grand Prix':'Gran Premio de Bélgica',
  'Dutch Grand Prix':'Gran Premio de Países Bajos','Italian Grand Prix':'Gran Premio de Italia',
  'Azerbaijan Grand Prix':'Gran Premio de Azerbaiyán','Singapore Grand Prix':'Gran Premio de Singapur',
  'United States Grand Prix':'Gran Premio de EE.UU.','Mexico City Grand Prix':'Gran Premio de México',
  'São Paulo Grand Prix':'Gran Premio de São Paulo','Las Vegas Grand Prix':'Gran Premio de Las Vegas',
  'Qatar Grand Prix':'Gran Premio de Catar','Abu Dhabi Grand Prix':'Gran Premio de Abu Dabi',
};

const PAIS_ES = {
  'Australia':'Australia','China':'China','Japan':'Japón','Bahrain':'Baréin',
  'Saudi Arabia':'Arabia Saudita','USA':'EE.UU.','Italy':'Italia','Monaco':'Mónaco',
  'Canada':'Canadá','Spain':'España','Austria':'Austria','UK':'Gran Bretaña',
  'Hungary':'Hungría','Belgium':'Bélgica','Netherlands':'Países Bajos',
  'Azerbaijan':'Azerbaiyán','Singapore':'Singapur','Mexico':'México',
  'Brazil':'Brasil','Qatar':'Catar','UAE':'Abu Dabi',
};

const TRACK_PHOTOS = {
  'Australia': 'Australia',
  'China': 'China',
  'Japan': 'Japan',
  'Bahrain': 'Bahrain',
  'Saudi Arabia': 'Saudi%20Arabia',
  'USA': 'Miami', // For Miami
  'Italy': 'Emilia%20Romagna', // For Imola
  'Monaco': 'Monaco',
  'Canada': 'Canada',
  'Spain': 'Spain',
  'Austria': 'Austria',
  'UK': 'Great%20Britain',
  'Hungary': 'Hungary',
  'Belgium': 'Belgium',
  'Netherlands': 'Netherlands',
  'Azerbaijan': 'Azerbaijan',
  'Singapore': 'Singapore',
  'Mexico': 'Mexico',
  'Brazil': 'Brazil',
  'Las Vegas': 'Las%20Vegas',
  'Qatar': 'Qatar',
  'UAE': 'Abu%20Dhabi'
};

const MESES = ['','ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

const fmtFecha = (d) => {
  if (!d) return '';
  const [y,m,day] = d.split('-');
  return `${parseInt(day)} ${MESES[parseInt(m)].toUpperCase()} ${y}`;
};

const safe = (promise) => promise.catch(() => null);

const useF1Data = () => {
  const [driverStandings,      setDriverStandings]      = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [calendar,             setCalendar]             = useState([]);
  const [lastRace,             setLastRace]             = useState(null);
  const [nextRace,             setNextRace]             = useState(null);
  const [loading,              setLoading]              = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);

      const [dsJson, csJson, calJson, lrJson] = await Promise.all([
        safe(fetch(`${BASE}/2024/driverStandings.json`).then(r => r.json())),
        safe(fetch(`${BASE}/2024/constructorStandings.json`).then(r => r.json())),
        safe(fetch(`${BASE}/2024/races.json`).then(r => r.json())),
        safe(fetch(`${BASE}/2024/last/results.json`).then(r => r.json())),
      ]);

      if (cancelled) return;

      // ── Pilotos ──
      const ds = dsJson?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
      // Filtrar a doohan manualmente ya que el usuario no lo quiere en la grilla de 2024 (solo corrió 1 carrera)
      const dsFiltered = ds.filter(s => s.Driver.driverId !== 'doohan');
      
      const mappedDs = dsFiltered.map(s => {
        const teamKey = Object.keys(TEAM_ASSETS).find(k => s.Constructors?.[0]?.name.includes(k));
        const assets = TEAM_ASSETS[teamKey] || {};
        return {
          ...s,
          img: DRIVER_IMGS[s.Driver.driverId] || 'https://media.formula1.com/content/dam/fom-website/drivers/fallback.png',
          teamLogo: assets.logo || 'https://media.formula1.com/image/upload/v1677237319/etc/designs/fom-website/images/f1_logo.svg'
        };
      });
      setDriverStandings(mappedDs);

      // ── Constructores ──
      const cs = csJson?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
      const mappedCs = cs.map(s => {
        const teamKey = Object.keys(TEAM_ASSETS).find(k => s.Constructor.name.includes(k));
        const assets = TEAM_ASSETS[teamKey] || {};
        return {
          ...s,
          logo: assets.logo || 'https://media.formula1.com/content/dam/fom-website/2024/team-logos/f1.png',
          car: assets.car || 'https://media.formula1.com/content/dam/fom-website/teams/2024/f1.png'
        };
      });
      setConstructorStandings(mappedCs);

      // ── Calendario ──
      const races = calJson?.MRData?.RaceTable?.Races || [];
      const mappedCal = races.map(r => {
        const countryKey = r.Circuit?.Location?.country || '';
        const photoPath = TRACK_PHOTOS[countryKey] || 'Great%20Britain';
        
        return {
          round:    parseInt(r.round),
          titleEs:  GP_ES[r.raceName] || r.raceName,
          circuito: r.Circuit?.circuitName || '',
          ciudad:   r.Circuit?.Location?.locality || '',
          pais:     PAIS_ES[countryKey] || countryKey,
          date:     r.date.replace('2024', '2026'),
          time:     r.time || '15:00:00Z',
          fechaEs:  fmtFecha(r.date.replace('2024', '2026')),
          trackMap: `https://media.formula1.com/image/upload/content/dam/fom-website/2018/manual/Circuit%20Maps/16x9/${r.Circuit?.circuitId}_Circuit.png`,
          trackPhoto: `https://media.formula1.com/image/upload/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/Racehub%20header%20images%2016x9/${photoPath}.jpg`
        };
      });
      setCalendar(mappedCal);

      const now = new Date();
      const next = mappedCal.find(r => new Date(r.date) >= now);
      setNextRace(next || mappedCal[mappedCal.length - 1] || null);

      // ── Última carrera ──
      const lrRace = lrJson?.MRData?.RaceTable?.Races?.[0];
      if (lrRace) {
        setLastRace({
          titleEs:  GP_ES[lrRace.raceName] || lrRace.raceName,
          titleEn:  lrRace.raceName,
          circuito: lrRace.Circuit?.circuitName || '',
          pais:     PAIS_ES[lrRace.Circuit?.Location?.country] || '',
          fecha:    fmtFecha(lrRace.date),
          round:    lrRace.round,
          season:   lrRace.season,
          results:  (lrRace.Results || []).map(res => ({
            pos:         res.position,
            num:         res.number,
            driver:      `${res.Driver?.givenName} ${res.Driver?.familyName}`,
            familyName:  res.Driver?.familyName?.toUpperCase(),
            givenName:   res.Driver?.givenName,
            code:        res.Driver?.code || '',
            team:        res.Constructor?.name || '',
            laps:        res.laps,
            time:        res.Time?.time || res.status || '',
            points:      res.points,
            grid:        res.grid,
            fastestLap:  res.FastestLap?.Time?.time || '',
            fastestLapRank: res.FastestLap?.rank,
            status:      res.status,
            driverImg:   DRIVER_IMGS[res.Driver.driverId]
          })),
        });
      }

      if (!cancelled) setLoading(false);
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return { driverStandings, constructorStandings, calendar, lastRace, nextRace, loading };
};

export default useF1Data;

