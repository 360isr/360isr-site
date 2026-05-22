// KASNIAN Decision Space Map — Live Demonstrator
// UNCLASSIFIED // TRAINING USE ONLY · Scenario fictitious · TULIP RESOLVE
// All node data is fabricated for the public training demo.

(function () {
  if (typeof Plotly === 'undefined') {
    console.error('Plotly.js is required for the KASNIAN demonstrator');
    return;
  }

  // 21 fabricated training nodes across 6 DSR categories.
  // weight (Y) = decision-forcing weight 1..10, x = polarity -1..+1
  const NODES = [
    // PIR / Kinetic (red ring) — 6 nodes
    { id: 'D03',  name: 'Convoy escort posture',         cat: 'pir', x: -0.30, w: 8.4, label: true  },
    { id: 'D11',  name: 'PZU/HSPN port shift decision',  cat: 'pir', x: -0.55, w: 9.1, label: true  },
    { id: 'D05',  name: 'Border crossing surveillance',  cat: 'pir', x: -0.18, w: 7.6, label: false },
    { id: 'D08',  name: 'Air-defence engagement zones',  cat: 'pir', x: -0.45, w: 8.8, label: true  },
    { id: 'D12',  name: 'Maritime interdiction line',    cat: 'pir', x: -0.10, w: 6.4, label: false },
    { id: 'D17',  name: 'Counter-UAS strike approval',   cat: 'pir', x: -0.25, w: 7.9, label: false },

    // ROE / Legal (orange) — 4
    { id: 'L02',  name: 'ROE counter-drone authorisation', cat: 'roe', x:  0.20, w: 7.8, label: true  },
    { id: 'L05',  name: 'Cross-border legal envelope',     cat: 'roe', x:  0.05, w: 6.9, label: false },
    { id: 'L09',  name: 'Detention authority handover',    cat: 'roe', x:  0.32, w: 5.4, label: false },
    { id: 'L13',  name: 'Civilian-harm mitigation rule',   cat: 'roe', x:  0.10, w: 7.2, label: false },

    // Fusion / COP (purple) — 4
    { id: 'F04',  name: 'Fusion gap: maritime SIGINT',     cat: 'fus', x: -0.08, w: 6.2, label: true  },
    { id: 'F07',  name: 'OSINT/HUMINT corroboration loop', cat: 'fus', x:  0.18, w: 5.6, label: false },
    { id: 'F11',  name: 'Pattern-of-life baseline drift',  cat: 'fus', x:  0.02, w: 7.4, label: false },
    { id: 'F14',  name: 'Adversary deception flag',        cat: 'fus', x: -0.38, w: 6.8, label: false },

    // ISR Tasking (cyan) — 4
    { id: 'I01',  name: 'Maritime ISR re-tasking',         cat: 'isr', x:  0.40, w: 7.1, label: true  },
    { id: 'I04',  name: 'MALE UAV orbit re-cue',           cat: 'isr', x:  0.55, w: 6.5, label: false },
    { id: 'I08',  name: 'SIGINT collection priority shift', cat: 'isr', x:  0.30, w: 7.6, label: false },
    { id: 'I12',  name: 'GMTI sweep over Sector 4',        cat: 'isr', x:  0.62, w: 5.9, label: false },

    // C2 / Comms (yellow) — 2
    { id: 'C03',  name: 'C2 reach-back authority shift',   cat: 'c2',  x:  0.48, w: 6.2, label: false },
    { id: 'C06',  name: 'Coalition liaison channel open',  cat: 'c2',  x:  0.70, w: 4.8, label: false },

    // OPSEC / EMCON (green) — 3
    { id: 'O02',  name: 'EMCON Bravo activation',          cat: 'ops', x:  0.25, w: 5.0, label: false },
    { id: 'O05',  name: 'OPSEC posture: convoy refuel',    cat: 'ops', x:  0.08, w: 4.4, label: false },
    { id: 'O08',  name: 'Signature management — air',      cat: 'ops', x:  0.38, w: 6.0, label: true  }
  ];

  const CAT = {
    pir: { label: 'PIR / Kinetic',    color: '#FF6B6B' },
    roe: { label: 'ROE / Legal',      color: '#FFA94D' },
    fus: { label: 'Fusion / COP',     color: '#B197FC' },
    isr: { label: 'ISR Tasking',      color: '#5BD1D7' },
    c2:  { label: 'C2 / Comms',       color: '#FFD43B' },
    ops: { label: 'OPSEC / EMCON',    color: '#69DB7C' }
  };

  const traces = Object.keys(CAT).map(catKey => {
    const c = CAT[catKey];
    const nodes = NODES.filter(n => n.cat === catKey);
    return {
      type: 'scatter',
      mode: 'markers+text',
      name: c.label,
      x: nodes.map(n => n.x),
      y: nodes.map(n => n.w),
      text: nodes.map(n => n.label ? `${n.id} · ${n.name}` : ''),
      textposition: 'top right',
      textfont: { family: 'JetBrains Mono, monospace', size: 10, color: 'rgba(230,236,241,0.78)' },
      hovertext: nodes.map(n =>
        `<b>${n.id} — ${n.name}</b><br>` +
        `DSR category: ${c.label}<br>` +
        `Decision-forcing weight: ${n.w.toFixed(1)}<br>` +
        `X polarity: ${n.x >= 0 ? '+' : ''}${n.x.toFixed(2)} (${n.x >= 0 ? 'enabling' : 'adversarial'})<br>` +
        `<span style="color:#D9A441;">— training scenario —</span>`
      ),
      hoverinfo: 'text',
      marker: {
        size: nodes.map(n => 12 + (n.w - 4) * 1.6), // 12-24px
        color: 'rgba(10,15,20,0.15)',
        opacity: 1,
        line: { color: c.color, width: 2 }
      },
      cliponaxis: false
    };
  });

  // dashed threshold line at Y=7.0
  const layout = {
    title: false,
    autosize: true,
    height: 620,
    margin: { l: 64, r: 36, t: 24, b: 56 },
    paper_bgcolor: '#07090C',
    plot_bgcolor: '#0A0F14',
    font: { family: 'Inter, system-ui, sans-serif', color: '#8A97A4', size: 12 },
    xaxis: {
      title: { text: 'X — Adversarial (-1)  →  Enabling (+1)', font: { size: 11, color: '#8A97A4' }, standoff: 16 },
      range: [-0.85, 0.95],
      zeroline: true,
      zerolinecolor: 'rgba(255,255,255,0.18)',
      zerolinewidth: 1,
      gridcolor: 'rgba(255,255,255,0.05)',
      tickfont: { size: 10, color: '#8A97A4' },
      tickcolor: 'rgba(255,255,255,0.1)',
      showline: true,
      linecolor: 'rgba(255,255,255,0.18)'
    },
    yaxis: {
      title: { text: 'Y — Routine (1)  →  Critical (10)', font: { size: 11, color: '#8A97A4' }, standoff: 16 },
      range: [2, 10.4],
      gridcolor: 'rgba(255,255,255,0.05)',
      tickfont: { size: 10, color: '#8A97A4' },
      tickcolor: 'rgba(255,255,255,0.1)',
      showline: true,
      linecolor: 'rgba(255,255,255,0.18)'
    },
    showlegend: false,
    shapes: [
      // dashed amber threshold
      {
        type: 'line',
        x0: -0.85, x1: 0.95, y0: 7.0, y1: 7.0,
        line: { color: '#D9A441', width: 1.5, dash: 'dash' }
      }
    ],
    annotations: [
      {
        x: 0.93, y: 7.05,
        xref: 'x', yref: 'y',
        text: 'T = 7.0 · Priority DSR threshold',
        showarrow: false,
        font: { family: 'JetBrains Mono, monospace', size: 10, color: '#D9A441' },
        xanchor: 'right', yanchor: 'bottom'
      },
      // classification corner-marks
      {
        x: 0, y: 1, xref: 'paper', yref: 'paper',
        text: 'UNCLASSIFIED // TRAINING USE ONLY',
        showarrow: false,
        font: { family: 'JetBrains Mono, monospace', size: 9.5, color: 'rgba(217,164,65,0.85)' },
        xanchor: 'left', yanchor: 'bottom', yshift: 6
      },
      {
        x: 1, y: 1, xref: 'paper', yref: 'paper',
        text: 'KASNIA · TULIP RESOLVE · training scenario',
        showarrow: false,
        font: { family: 'JetBrains Mono, monospace', size: 9.5, color: 'rgba(138,151,164,0.75)' },
        xanchor: 'right', yanchor: 'bottom', yshift: 6
      }
    ],
    hoverlabel: {
      bgcolor: '#0E141B',
      bordercolor: '#D9A441',
      font: { family: 'Inter, sans-serif', color: '#E6ECF1', size: 12 },
      align: 'left'
    }
  };

  const config = {
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'lasso2d', 'select2d', 'autoScale2d',
      'toggleSpikelines', 'hoverClosestCartesian',
      'hoverCompareCartesian', 'sendDataToCloud'
    ],
    displayModeBar: 'hover',
    toImageButtonOptions: { filename: 'kasnian-decision-space-map' }
  };

  const target = document.getElementById('kasnian-plot');
  if (target) {
    Plotly.newPlot(target, traces, layout, config);
  }
})();
