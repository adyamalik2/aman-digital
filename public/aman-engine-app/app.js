function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect,
  useRef
} = React;
const DEFAULT_API_KEY = null;
const DRAFT_STORAGE_KEY = "aman_engine_draft_v1";
const Icons = {
  Layers: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("polygon", {
    points: "12 2 2 7 12 12 22 7 12 2"
  }), React.createElement("polyline", {
    points: "2 17 12 22 22 17"
  }), React.createElement("polyline", {
    points: "2 12 12 17 22 12"
  })),
  Check: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  })),
  User: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
  }), React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  })),
  Image: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("rect", {
    width: "18",
    height: "18",
    x: "3",
    y: "3",
    rx: "2",
    ry: "2"
  }), React.createElement("circle", {
    cx: "9",
    cy: "9",
    r: "2"
  }), React.createElement("path", {
    d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
  })),
  Trash2: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M3 6h18"
  }), React.createElement("path", {
    d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
  }), React.createElement("path", {
    d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
  }), React.createElement("line", {
    x1: "10",
    x2: "10",
    y1: "11",
    y2: "17"
  }), React.createElement("line", {
    x1: "14",
    x2: "14",
    y1: "11",
    y2: "17"
  })),
  Type: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("polyline", {
    points: "4 7 4 4 20 4 20 7"
  }), React.createElement("line", {
    x1: "9",
    x2: "15",
    y1: "20",
    y2: "20"
  }), React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "4",
    y2: "20"
  })),
  Plus: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "5",
    y2: "19"
  }), React.createElement("line", {
    x1: "5",
    x2: "19",
    y1: "12",
    y2: "12"
  })),
  Copy: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("rect", {
    width: "14",
    height: "14",
    x: "8",
    y: "8",
    rx: "2",
    ry: "2"
  }), React.createElement("path", {
    d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
  })),
  Sparkles: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
  })),
  Code: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("polyline", {
    points: "16 18 22 12 16 6"
  }), React.createElement("polyline", {
    points: "8 6 2 12 8 18"
  })),
  BookOpen: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
  }), React.createElement("path", {
    d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
  })),
  Share: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
  }), React.createElement("polyline", {
    points: "16 6 12 2 8 6"
  }), React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "2",
    y2: "15"
  })),
  FileText: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  }), React.createElement("line", {
    x1: "16",
    x2: "8",
    y1: "13",
    y2: "13"
  }), React.createElement("line", {
    x1: "16",
    x2: "8",
    y1: "17",
    y2: "17"
  }), React.createElement("polyline", {
    points: "10 9 9 9 8 9"
  })),
  Yarn: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), React.createElement("path", {
    d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
  }), React.createElement("path", {
    d: "M2 12h20"
  })),
  Palette: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("circle", {
    cx: "13.5",
    cy: "6.5",
    r: ".5",
    fill: "currentColor"
  }), React.createElement("circle", {
    cx: "17.5",
    cy: "10.5",
    r: ".5",
    fill: "currentColor"
  }), React.createElement("circle", {
    cx: "8.5",
    cy: "7.5",
    r: ".5",
    fill: "currentColor"
  }), React.createElement("circle", {
    cx: "6.5",
    cy: "12.5",
    r: ".5",
    fill: "currentColor"
  }), React.createElement("path", {
    d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
  })),
  Scissors: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "3"
  }), React.createElement("circle", {
    cx: "6",
    cy: "18",
    r: "3"
  }), React.createElement("line", {
    x1: "20",
    x2: "8.12",
    y1: "4",
    y2: "15.88"
  }), React.createElement("line", {
    x1: "14.47",
    x2: "20",
    y1: "14.48",
    y2: "20"
  }), React.createElement("line", {
    x1: "8.12",
    x2: "12",
    y1: "8.12",
    y2: "12"
  })),
  Bear: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8"
  }), React.createElement("path", {
    d: "M7 6c0-1.5 1-2.5 2.5-2.5S12 4.5 12 6"
  }), React.createElement("path", {
    d: "M17 6c0-1.5-1-2.5-2.5-2.5S12 4.5 12 6"
  }), React.createElement("circle", {
    cx: "9",
    cy: "11",
    r: "1",
    fill: "currentColor"
  }), React.createElement("circle", {
    cx: "15",
    cy: "11",
    r: "1",
    fill: "currentColor"
  }), React.createElement("path", {
    d: "M12 15a2 2 0 0 0 0 2 2 2 0 0 0 0-2"
  })),
  Brush: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"
  }), React.createElement("path", {
    d: "M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2.5 2.24 0 .46.62.92 1.25.92 1.76 0 2.5-1.15 2.5-2.24 0-1.67 1.34-3.02 3-3.02S11.32 17.26 11.32 18.93c0 1.09.74 2.24 2.5 2.24.63 0 1.25-.46 1.25-.92 0-.72-2.5-.91-2.5-2.24 0-1.67-1.34-3.02-3-3.02z"
  })),
  PenTool: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "m12 19 7-7 3 3-7 7-3-3z"
  }), React.createElement("path", {
    d: "m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"
  }), React.createElement("path", {
    d: "m2 2 7.586 7.586"
  }), React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "2"
  })),
  RefreshCw: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
  }), React.createElement("path", {
    d: "M3 3v5h5"
  })),
  Download: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), React.createElement("polyline", {
    points: "7 10 12 15 17 10"
  }), React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "15",
    y2: "3"
  })),
  ImagePlus: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"
  }), React.createElement("line", {
    x1: "16",
    x2: "22",
    y1: "5",
    y2: "5"
  }), React.createElement("line", {
    x1: "19",
    x2: "19",
    y1: "2",
    y2: "8"
  }), React.createElement("circle", {
    cx: "9",
    cy: "9",
    r: "2"
  }), React.createElement("path", {
    d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
  })),
  Loader2: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M21 12a9 9 0 1 1-6.219-8.56"
  })),
  KeyIcon: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"
  }), React.createElement("path", {
    d: "m21 2-9.6 9.6"
  }), React.createElement("circle", {
    cx: "7.5",
    cy: "15.5",
    r: "5.5"
  })),
  Upload: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), React.createElement("polyline", {
    points: "17 8 12 3 7 8"
  }), React.createElement("line", {
    x1: "12",
    x2: "12",
    y1: "3",
    y2: "15"
  })),
  XCircle: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), React.createElement("path", {
    d: "m15 9-6 6"
  }), React.createElement("path", {
    d: "m9 9 6 6"
  })),
  X: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })),
  Film: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("rect", {
    width: "18",
    height: "18",
    x: "3",
    y: "3",
    rx: "2"
  }), React.createElement("path", {
    d: "M7 3v18"
  }), React.createElement("path", {
    d: "M3 7.5h4"
  }), React.createElement("path", {
    d: "M3 12h18"
  }), React.createElement("path", {
    d: "M3 16.5h4"
  }), React.createElement("path", {
    d: "M17 3v18"
  }), React.createElement("path", {
    d: "M17 7.5h4"
  }), React.createElement("path", {
    d: "M17 16.5h4"
  })),
  Lightbulb: props => React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, props), React.createElement("path", {
    d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"
  }), React.createElement("path", {
    d: "M9 18h6"
  }), React.createElement("path", {
    d: "M10 22h4"
  }))
};
const {
  Layers,
  Check,
  User,
  Image,
  Trash2,
  Type,
  Plus,
  Copy,
  Sparkles,
  Code,
  BookOpen,
  Share,
  FileText,
  Yarn,
  Palette,
  Scissors,
  Bear,
  Brush,
  PenTool,
  RefreshCw,
  Download,
  ImagePlus,
  Loader2,
  KeyIcon,
  Upload,
  XCircle,
  X,
  Film,
  Lightbulb
} = Icons;
const TEXT_ROLES = [{
  id: 'title_main',
  label: 'Judul Utama',
  maxChars: 26
}, {
  id: 'title_sub',
  label: 'Sub-Judul',
  maxChars: 34
}, {
  id: 'narration',
  label: 'Narasi (Box Cerita)',
  maxChars: 34
}, {
  id: 'speech_bubble',
  label: 'Gelembung Bicara',
  maxChars: 24
}, {
  id: 'thought_bubble',
  label: 'Gelembung Pikiran',
  maxChars: 24
}, {
  id: 'sfx',
  label: 'Efek Suara (Duar/Kring)',
  maxChars: 15
}, {
  id: 'time_loc',
  label: 'Ket. Waktu/Tempat',
  maxChars: 20
}, {
  id: 'phone_screen',
  label: 'Layar HP/Laptop',
  maxChars: 20
}, {
  id: 'book_text',
  label: 'Teks Buku/Kertas',
  maxChars: 25
}, {
  id: 'keyword_badge',
  label: 'Stiker/Badge',
  maxChars: 14
}, {
  id: 'label_prop',
  label: 'Label Benda',
  maxChars: 18
}, {
  id: 'signage',
  label: 'Papan Tanda',
  maxChars: 18
}, {
  id: 'direction_board',
  label: 'Penunjuk Arah',
  maxChars: 18
}, {
  id: 'clothing_text',
  label: 'Tulisan di Baju',
  maxChars: 15
}, {
  id: 'watermark',
  label: 'Watermark',
  maxChars: 30
}, {
  id: 'custom',
  label: 'Custom / Lainnya (Isi Sendiri)',
  maxChars: 40
}];
const STORY_GENRES = [{
  id: 'general',
  label: 'Umum / Bebas'
}, {
  id: 'islamic',
  label: 'Cerita Islami / Dakwah'
}, {
  id: 'facts',
  label: 'Fakta Unik / Edukasi'
}, {
  id: 'daily',
  label: 'Kehidupan Sehari-hari'
}, {
  id: 'motivation',
  label: 'Motivasi / Bijak'
}, {
  id: 'humor',
  label: 'Humor / Lucu'
}, {
  id: 'tips',
  label: 'Tips & Trik'
}, {
  id: 'custom',
  label: 'Custom / Lainnya (Isi Sendiri)'
}];
const VISUAL_STYLES = [{
  id: 'knitted',
  label: 'Knitted Wool',
  icon: Yarn,
  prompt: 'Knitted felt craft miniature diorama. Materials: Soft cotton yarn knit, smooth felt textures, matte finish. Camera: Macro photography vibe.'
}, {
  id: 'claymation',
  label: 'Claymation',
  icon: Palette,
  prompt: 'Claymation style, plasticine texture, fingerprint details, stop-motion animation look. Lighting: Soft cinematic studio light.'
}, {
  id: 'paper',
  label: 'Paper Craft',
  icon: Scissors,
  prompt: 'Layered paper craft style, origami textures, paper cut-out aesthetic, soft shadows to show depth.'
}, {
  id: '3d_toy',
  label: '3D Mini Toy',
  icon: Bear,
  prompt: '3D glossy plastic miniature toy, tilt-shift photography, vibrant colors, smooth shading, cute chibi proportions.'
}, {
  id: 'watercolor',
  label: 'Watercolor',
  icon: Brush,
  prompt: 'Soft watercolor painting style, bleeding colors, artistic brush strokes, paper texture background, dreamy atmosphere.'
}, {
  id: 'custom',
  label: 'Custom Style',
  icon: PenTool,
  prompt: ''
}];
const buildFriendlyApiErrorMessage = (rawMessage, status) => {
  const isQuotaError = status === 429 || /quota|RESOURCE_EXHAUSTED/i.test(rawMessage || '');
  if (!isQuotaError) return rawMessage;
  const retryMatch = (rawMessage || '').match(/retry in ([\d.]+)\s*s/i);
  const waitSeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
  return waitSeconds ? `Kuota API gratis Gemini sudah habis untuk saat ini (limit: 20 permintaan/menit). Coba lagi dalam ${waitSeconds} detik.` : `Kuota API gratis Gemini sudah habis untuk saat ini. Google membatasi jumlah permintaan per menit untuk akun gratis — coba lagi sesaat lagi.`;
};
const fetchGeminiWithRetry = async (url, options, retries = 3) => {
  let delay = 1000;
  for (let i = 0; i < retries; i++) {
    let res;
    try {
      res = await fetch(url, options);
    } catch (networkError) {
      if (i === retries - 1) throw networkError;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
      continue;
    }
    if (res.ok) return await res.json();
    const errData = await res.json().catch(() => ({}));
    const rawMessage = errData.error?.message || `HTTP Error: ${res.status}`;
    const isRetryable = res.status === 429 || res.status >= 500;
    if (!isRetryable || i === retries - 1) {
      throw new Error(buildFriendlyApiErrorMessage(rawMessage, res.status));
    }
    await new Promise(r => setTimeout(r, delay));
    delay *= 2;
  }
};
function App() {
  const [globalWatermark, setGlobalWatermark] = useState("@adya.vision");
  const [character, setCharacter] = useState({
    name: "Sarah",
    species: "human",
    gender: "female",
    age_group: "adult",
    body_scale: "average",
    yarn_color_palette: ["olive_green", "warm_beige", "cream_white"],
    outfit: ["long modest dress (gamis) in olive green felt", "wide head covering (hijab syar'i) in warm beige soft knit", "simple texture, loose fit"],
    accessories: ["miniature felt Quran book", "prayer mat texture"],
    distinctive_markers: ["faceless rounded head", "soft fabric seams visible", "no facial features"],
    personality_notes: ["reflective", "calm", "observant"]
  });
  const [storyMetadata, setStoryMetadata] = useState({
    description: "Filosofi rumah laba-laba dalam Al-Qur'an mengingatkan kita tentang pentingnya fondasi iman. Yuk simak kisahnya!",
    hashtags: "#CeritaIslami #DakwahVisual #StopMotion #KaryaRajut #InspirasiIman #FYP",
    notes: "Gunakan musik instrumental islami yang tenang. Posting di jam istirahat siang."
  });
  const [scenes, setScenes] = useState([{
    id: 1,
    arc_stage: "Introduction",
    action: "Sarah is pointing gently at a fragile white yarn spider web in the corner",
    location: "minimalist_felt_room_corner",
    background_elements: ["soft blurred felt wall", "miniature spider web"],
    emotion: "realization",
    voice_over: "Rumah paling rapuh di dunia ternyata bukan rumah kardus, tapi rumah laba-laba.",
    texts: [{
      role: 'narration',
      content: 'Rumah paling rapuh di dunia ternyata bukan rumah kardus,'
    }, {
      role: 'speech_bubble',
      content: 'tapi rumah laba-laba.'
    }, {
      role: 'watermark',
      content: '@adya.vision'
    }]
  }]);
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [expandedSections, setExpandedSections] = useState({});
  const toggleSectionExpanded = key => setExpandedSections(prev => ({
    ...prev,
    [key]: !prev[key]
  }));
  const [expandedVideoPrompts, setExpandedVideoPrompts] = useState({});
  const toggleVideoPromptExpanded = idx => setExpandedVideoPrompts(prev => ({
    ...prev,
    [idx]: !prev[idx]
  }));
  const [expandedInputSections, setExpandedInputSections] = useState({});
  const isInputSectionOpen = key => expandedInputSections[key] !== false;
  const toggleInputSectionExpanded = key => setExpandedInputSections(prev => ({
    ...prev,
    [key]: !isInputSectionOpen(key)
  }));
  const [aiTopic, setAiTopic] = useState("");
  const [aiGenre, setAiGenre] = useState("general");
  const [customGenrePrompt, setCustomGenrePrompt] = useState("");
  const [visualStyle, setVisualStyle] = useState("knitted");
  const [customStylePrompt, setCustomStylePrompt] = useState("");
  const [userInstructions, setUserInstructions] = useState("");
  const [sceneCount, setSceneCount] = useState(5);
  const [isAutoSceneCount, setIsAutoSceneCount] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [aiError, setAiError] = useState(null);
  const fileInputRef = useRef(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isGeneratingTopicIdea, setIsGeneratingTopicIdea] = useState(false);
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [isOptimizingCaption, setIsOptimizingCaption] = useState(false);
  const [generatingVoiceOverFor, setGeneratingVoiceOverFor] = useState({});
  const [isOutdated, setIsOutdated] = useState(false);
  useEffect(() => {
    if (generatedOutput !== null) {
      setIsOutdated(true);
    }
  }, [character, storyMetadata, scenes, visualStyle, customStylePrompt, uploadedImages, isAutoSceneCount, sceneCount]);
  const nameBeforeEditRef = useRef(character.name);
  const [nameChangeNotice, setNameChangeNotice] = useState(null);
  const notifyIfNameStillUsedInScenes = (oldName, newName) => {
    if (!oldName || oldName.trim() === "" || oldName === newName) return;
    const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const oldNameRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    const stillUsesOldName = scenes.some(s => oldNameRegex.test(s.action || '') || s.texts.some(t => oldNameRegex.test(t.content || '')));
    if (stillUsesOldName) {
      setNameChangeNotice({
        oldName
      });
    }
  };
  const applyNameSync = () => {
    if (!nameChangeNotice) return;
    const newName = character.name;
    const escaped = nameChangeNotice.oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    setScenes(prev => prev.map(s => ({
      ...s,
      action: (s.action || '').replace(regex, newName),
      texts: s.texts.map(t => ({
        ...t,
        content: (t.content || '').replace(regex, newName)
      }))
    })));
    setNameChangeNotice(null);
  };
  const dismissNameChangeNotice = () => setNameChangeNotice(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!saved) return;
      const draft = JSON.parse(saved);
      if (draft.character) setCharacter(draft.character);
      if (draft.storyMetadata) setStoryMetadata(draft.storyMetadata);
      if (draft.scenes) setScenes(draft.scenes);
      if (draft.globalWatermark !== undefined) setGlobalWatermark(draft.globalWatermark);
      if (draft.visualStyle) setVisualStyle(draft.visualStyle);
      if (draft.customStylePrompt !== undefined) setCustomStylePrompt(draft.customStylePrompt);
      if (draft.customGenrePrompt !== undefined) setCustomGenrePrompt(draft.customGenrePrompt);
      if (draft.aiGenre) setAiGenre(draft.aiGenre);
      if (draft.aiTopic !== undefined) setAiTopic(draft.aiTopic);
      if (draft.userInstructions !== undefined) setUserInstructions(draft.userInstructions);
      if (draft.sceneCount) setSceneCount(draft.sceneCount);
      if (draft.isAutoSceneCount !== undefined) setIsAutoSceneCount(draft.isAutoSceneCount);
    } catch (e) {
      console.error("Gagal memuat draft tersimpan:", e);
    }
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const draft = {
        character,
        storyMetadata,
        scenes,
        globalWatermark,
        visualStyle,
        customStylePrompt,
        customGenrePrompt,
        aiGenre,
        aiTopic,
        userInstructions,
        sceneCount,
        isAutoSceneCount
      };
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      } catch (e) {
        console.error("Gagal menyimpan draft:", e);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [character, storyMetadata, scenes, globalWatermark, visualStyle, customStylePrompt, customGenrePrompt, aiGenre, aiTopic, userInstructions, sceneCount, isAutoSceneCount]);
  const addScene = () => {
    const newId = scenes.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const baseTexts = [];
    if (globalWatermark.trim() !== "") {
      baseTexts.push({
        role: 'watermark',
        content: globalWatermark
      });
    }
    setScenes([...scenes, {
      id: newId,
      arc_stage: "Generic",
      action: "",
      location: "",
      background_elements: [],
      emotion: "neutral",
      voice_over: "",
      texts: baseTexts
    }]);
  };
  const updateScene = (index, field, value) => {
    const newScenes = [...scenes];
    newScenes[index][field] = value;
    setScenes(newScenes);
  };
  const addTextToScene = sceneIndex => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].texts.push({
      role: 'speech_bubble',
      content: '',
      customLabel: ''
    });
    setScenes(newScenes);
  };
  const updateTextElement = (sceneIndex, textIndex, field, value) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].texts[textIndex][field] = value;
    setScenes(newScenes);
  };
  const removeTextElement = (sceneIndex, textIndex) => {
    const newScenes = [...scenes];
    newScenes[sceneIndex].texts.splice(textIndex, 1);
    setScenes(newScenes);
  };
  const handleImageSelect = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newImagesPromises = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          const rawBase64 = base64String.split(',')[1];
          resolve({
            id: Math.random().toString(36).substring(7),
            preview: base64String,
            mimeType: file.type,
            data: rawBase64
          });
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(newImagesPromises).then(newImages => {
      setUploadedImages(prev => [...prev, ...newImages]);
      setAiError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };
  const removeUploadedImage = idToRemove => {
    setUploadedImages(prev => prev.filter(img => img.id !== idToRemove));
  };
  const clearUploadedImages = () => {
    setUploadedImages([]);
  };
  const analyzeImageForTopic = async () => {
    if (uploadedImages.length === 0) return;
    setIsAnalyzingImage(true);
    setAiError(null);
    const activeKey = DEFAULT_API_KEY;
    try {
      const imageParts = uploadedImages.map(img => ({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data
        }
      }));
      const data = await fetchGeminiWithRetry("/aman-engine/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: "Analisa gambar-gambar referensi ini dan berikan SATU topik cerita singkat (maksimal 4-6 kata) dalam bahasa Indonesia yang sangat menarik untuk dijadikan konten storytelling TikTok/Instagram. HANYA KEMBALIKAN TEKS TOPIKNYA SAJA TANPA TANDA KUTIP."
            }, ...imageParts]
          }]
        })
      });
      const topic = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (topic) {
        setAiTopic(topic.trim().replace(/['"]/g, ''));
      } else {
        throw new Error("Respon tidak valid dari AI");
      }
    } catch (err) {
      console.error(err);
      setAiError("Gagal analisa gambar: " + err.message);
    } finally {
      setIsAnalyzingImage(false);
    }
  };
  const generateTopicIdea = async () => {
    setIsGeneratingTopicIdea(true);
    setAiError(null);
    const activeKey = DEFAULT_API_KEY;
    let selectedGenreLabel = aiGenre === 'custom' ? customGenrePrompt || "Bebas" : STORY_GENRES.find(g => g.id === aiGenre)?.label || "Bebas";
    try {
      const prompt = `Berikan SATU ide topik cerita singkat (maksimal 4-6 kata) dalam bahasa Indonesia yang sangat menarik, kreatif, atau unik untuk dijadikan konten storytelling faceless TikTok/Instagram dengan genre "${selectedGenreLabel}". HANYA KEMBALIKAN TEKS TOPIKNYA SAJA TANPA TANDA KUTIP.`;
      const data = await fetchGeminiWithRetry("/aman-engine/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      const topic = data.candidates[0].content.parts[0].text;
      setAiTopic(topic.trim().replace(/['"]/g, ''));
    } catch (error) {
      console.error(error);
      setAiError("Gagal mendapatkan ide topik: " + error.message);
    } finally {
      setIsGeneratingTopicIdea(false);
    }
  };
  const autoGenerateCharacter = async () => {
    if (!aiTopic.trim()) {
      setAiError("Mohon isi 'Topik Utama' terlebih dahulu agar AI mengetahui konteks cerita.");
      return;
    }
    setIsGeneratingCharacter(true);
    setAiError(null);
    const activeKey = DEFAULT_API_KEY;
    let selectedStyleLabel = visualStyle !== 'custom' ? VISUAL_STYLES.find(s => s.id === visualStyle)?.label || "Knitted Wool" : customStylePrompt || "Custom User Style";
    try {
      const prompt = `Buatkan detail desain karakter utama untuk cerita dengan topik "${aiTopic}".
                    Gaya visual yang akan digunakan adalah: ${selectedStyleLabel}.
                    Karakter harus relevan dengan topik tersebut. HARUS BERSIFAT FACELESS (tanpa fitur wajah).
                    Kembalikan HANYA format JSON valid tanpa format markdown \`\`\`json. Skema JSON:
                    {
                        "name": "Nama pendek karakter",
                        "outfit": ["Deskripsi pakaian 1 (misal: jaket merah tebal)", "Deskripsi pakaian 2"],
                        "yarn_color_palette": ["Warna 1 (misal: crimson_red)", "Warna 2", "Warna 3"],
                        "accessories": ["Aksesoris 1 (misal: tas punggung rajut)"],
                        "personality_notes": ["Sifat 1 (misal: pemberani)", "Sifat 2"]
                    }`;
      const data = await fetchGeminiWithRetry("/aman-engine/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      let resultText = data.candidates[0].content.parts[0].text;
      resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(resultText);
      const oldName = character.name;
      setCharacter(prev => ({
        ...prev,
        name: parsedData.name || prev.name,
        outfit: parsedData.outfit || prev.outfit,
        yarn_color_palette: parsedData.yarn_color_palette || prev.yarn_color_palette,
        accessories: parsedData.accessories || prev.accessories,
        personality_notes: parsedData.personality_notes || prev.personality_notes
      }));
      if (parsedData.name) {
        notifyIfNameStillUsedInScenes(oldName, parsedData.name);
      }
    } catch (error) {
      console.error(error);
      setAiError("Gagal men-generate desain karakter: " + error.message);
    } finally {
      setIsGeneratingCharacter(false);
    }
  };
  const optimizeCaption = async () => {
    if (!storyMetadata.description.trim()) return;
    setIsOptimizingCaption(true);
    const activeKey = DEFAULT_API_KEY;
    try {
      const prompt = `Tulis ulang caption/deskripsi TikTok berikut agar lebih VIRAL, mengundang komentar (engaging), dan relate dengan netizen. 
                    Gunakan bahasa Indonesia kasual yang kekinian. Gunakan teknik copywriting hook yang memancing rasa penasaran.
                    Caption asli: "${storyMetadata.description}"
                    
                    Kembalikan HANYA teks caption hasil optimasinya saja, tanpa tanda kutip dan tanpa penjelasan tambahan.`;
      const data = await fetchGeminiWithRetry("/aman-engine/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      const newCaption = data.candidates[0].content.parts[0].text;
      setStoryMetadata(prev => ({
        ...prev,
        description: newCaption.trim()
      }));
    } catch (error) {
      console.error(error);
      alert("Gagal merombak caption: " + error.message);
    } finally {
      setIsOptimizingCaption(false);
    }
  };
  const autoGenerateVoiceOver = async idx => {
    const scene = scenes[idx];
    if (!scene || !scene.action || !scene.action.trim()) {
      setAiError("Isi 'Aksi' scene ini dulu agar AI tahu konteksnya sebelum membuat voice over.");
      return;
    }
    setGeneratingVoiceOverFor(prev => ({
      ...prev,
      [idx]: true
    }));
    setAiError(null);
    const activeKey = DEFAULT_API_KEY;
    try {
      const existingTexts = scene.texts.map(t => t.content).filter(Boolean).join(' | ');
      const prompt = `Buatkan SATU naskah voice over (narasi yang akan dibacakan narator) dalam Bahasa Indonesia yang natural dan mengalir, untuk satu scene video pendek TikTok/Instagram.
                    Aksi di scene ini: "${scene.action}".
                    Lokasi: "${scene.location || '-'}". Emosi: "${scene.emotion || '-'}".
                    Teks yang sudah tampil di layar pada scene ini (jangan diulang persis): "${existingTexts || '-'}".
                    Naskah harus singkat (1-2 kalimat pendek), cocok dibacakan dalam beberapa detik saja, dan MELENGKAPI teks di layar, bukan mengulanginya kata demi kata.
                    Kembalikan HANYA teks naskahnya saja, tanpa tanda kutip dan tanpa penjelasan tambahan.`;
      const data = await fetchGeminiWithRetry("/aman-engine/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      const voiceOverText = data.candidates[0].content.parts[0].text;
      updateScene(idx, 'voice_over', voiceOverText.trim().replace(/^["']|["']$/g, ''));
    } catch (error) {
      console.error(error);
      setAiError("Gagal membuat voice over: " + error.message);
    } finally {
      setGeneratingVoiceOverFor(prev => ({
        ...prev,
        [idx]: false
      }));
    }
  };
  const generateStoryWithAI = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingStory(true);
    setAiError(null);
    let selectedGenreLabel = aiGenre === 'custom' ? customGenrePrompt || "Bebas" : STORY_GENRES.find(g => g.id === aiGenre)?.label || "Bebas";
    let selectedStyleLabel = visualStyle !== 'custom' ? VISUAL_STYLES.find(s => s.id === visualStyle)?.label || "Knitted Wool" : customStylePrompt || "Custom User Style";
    const validTextRoles = TEXT_ROLES.filter(r => r.id !== 'custom' && r.id !== 'watermark').map(r => r.id).join(', ');
    let sceneInstruction = isAutoSceneCount ? "TASK: Create a storyboard with an appropriate number of scenes (between 3 to 12) based on: " : `TASK: Create a storyboard with EXACTLY ${sceneCount} scenes based on: `;
    let exactSceneRule = isAutoSceneCount ? "6. GENERATE an appropriate number of scenes (between 3 and 12) to best tell the story." : `6. GENERATE EXACTLY ${sceneCount} SCENES. No more, no less.`;
    let systemPromptText = `
                You are AMAN, an AI assistant for generating storyboard JSONs for a comic.
                ${sceneInstruction} "${aiTopic}".
                GENRE/TONE: ${selectedGenreLabel}.
                VISUAL STYLE: ${selectedStyleLabel} (Customize descriptions to fit this style).
                USER INSTRUCTIONS: "${userInstructions}".
                `;
    if (uploadedImages.length > 0) {
      systemPromptText += `\nCRITICAL: The user has provided ${uploadedImages.length} reference image(s). Use these images as STRICT VISUAL CONTEXT for the story. Incorporate elements, props, actions, or themes found in the images into the scenes seamlessly.`;
    }
    systemPromptText += `
                OUTPUT: JSON Object.
                SCHEMA: 
                {
                  "character": {
                      "name": "string",
                      "outfit": ["string"],
                      "yarn_color_palette": ["string"],
                      "accessories": ["string"],
                      "personality_notes": ["string"]
                  },
                  "scenes": [
                    {
                        "arc_stage": "string",
                        "action": "string",
                        "location": "string",
                        "emotion": "string",
                        "voice_over": "Indonesian narration script to be spoken by a voice-over narrator for this scene",
                        "texts": [
                            {
                                "role": "string (one of: ${validTextRoles})",
                                "content": "Indonesian string"
                            }
                        ]
                    }
                  ],
                  "description": "TikTok caption in Indonesian",
                  "hashtags": "Relevant hashtags",
                  "notes": "Strategy notes"
                }

                RULES:
                1. Text content MUST be in natural, casual Indonesian.
                2. Vary text roles appropriately (title_main only for scene 1).
                3. Create character details fitting the topic.
                4. IMPORTANT: CHARACTER MUST BE FACELESS (no eyes, no nose, no mouth) regardless of the visual style.
                5. "voice_over" MUST be natural spoken Indonesian (1-2 sentences), flowing smoothly from scene to scene like a single continuous narration when read in order. It may reuse or lightly expand the on-screen text, but must not feel disconnected from neighboring scenes.
                ${exactSceneRule}
                `;
    const activeKey = DEFAULT_API_KEY;
    try {
      const partsArray = [{
        text: systemPromptText
      }];
      if (uploadedImages.length > 0) {
        uploadedImages.forEach(img => {
          partsArray.push({
            inlineData: {
              mimeType: img.mimeType,
              data: img.data
            }
          });
        });
      }
      const data = await fetchGeminiWithRetry("/aman-engine/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: partsArray
          }]
        })
      });
      let result = data.candidates[0].content.parts[0].text;
      result = result.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(result);
      if (parsedData.character) {
        setCharacter({
          name: parsedData.character.name || character.name,
          species: "human",
          gender: "neutral",
          age_group: "adult",
          body_scale: "average",
          yarn_color_palette: parsedData.character.yarn_color_palette || [],
          outfit: parsedData.character.outfit || [],
          accessories: parsedData.character.accessories || [],
          distinctive_markers: character.distinctive_markers,
          personality_notes: parsedData.character.personality_notes || []
        });
      }
      const newScenes = (parsedData.scenes || []).map((s, idx) => {
        const sceneTexts = s.texts || [];
        if (globalWatermark.trim() !== "") {
          sceneTexts.push({
            role: 'watermark',
            content: globalWatermark
          });
        }
        return {
          id: idx + 1,
          arc_stage: s.arc_stage || `Scene ${idx + 1}`,
          action: s.action,
          location: s.location,
          background_elements: [],
          emotion: s.emotion || "neutral",
          voice_over: s.voice_over || "",
          texts: sceneTexts
        };
      });
      setScenes(newScenes);
      if (isAutoSceneCount) {
        setSceneCount(newScenes.length);
      }
      setStoryMetadata({
        description: parsedData.description || "",
        hashtags: parsedData.hashtags || "",
        notes: parsedData.notes || ""
      });
      setActiveTab('input');
    } catch (error) {
      setAiError("Gagal: " + error.message);
    } finally {
      setIsGeneratingStory(false);
    }
  };
  const generateJSON = () => {
    let selectedStylePrompt = visualStyle === 'custom' ? customStylePrompt : VISUAL_STYLES.find(s => s.id === visualStyle)?.prompt || "Knitted felt style";
    const fullOutput = {
      character_bible_and_scenes: {
        character_bible: [character],
        social_media_metadata: {
          description: storyMetadata.description,
          hashtags: storyMetadata.hashtags,
          strategy_notes: storyMetadata.notes
        },
        scenes: scenes.map((scene, idx) => {
          const storyTextElements = scene.texts.map(t => ({
            role: t.role === 'custom' ? t.customLabel : t.role,
            text: t.content,
            placement: t.role === 'watermark' ? "bottom_center" : "auto_optimized",
            style_notes: t.role === 'watermark' ? "subtle translucent text" : "consistent with visual style",
            must_be_legible: true,
            must_match_exact_spelling: true,
            must_match_exact_punctuation: true,
            no_translation: true,
            no_paraphrase: true
          }));
          let textInstructions = "";
          if (scene.texts.length > 0) {
            textInstructions = "MANDATORY INDONESIAN TEXT RENDERING: ";
            scene.texts.forEach(t => {
              let label = t.role;
              if (t.role === 'custom') label = t.customLabel || 'Custom Text';else if (t.role === 'watermark') label = 'Watermark in bottom center';else {
                const roleDef = TEXT_ROLES.find(r => r.id === t.role);
                label = roleDef ? roleDef.label : t.role;
              }
              textInstructions += `Render [${label}] with text "${t.content}". `;
            });
          }
          const outfitDesc = character.outfit.filter(Boolean).join(', ') || 'outfit';
          const colorDesc = character.yarn_color_palette.length > 0 ? ` Color palette: ${character.yarn_color_palette.join(', ')}.` : '';
          const accessoriesDesc = character.accessories.length > 0 ? ` Accessories: ${character.accessories.join(', ')}.` : '';
          const actionText = (scene.action || '').trim().replace(/[.!?]+$/, '');
          const promptString = `Portrait 4:5. ${selectedStylePrompt} ${character.name} (${outfitDesc}), ${character.distinctive_markers.join(', ')}.${colorDesc}${accessoriesDesc} ${actionText}. Context: ${scene.location}. Emotion: ${scene.emotion}. ${textInstructions} --no eyes, mouth, nose, facial features`.trim();
          return {
            scene_id: `S${String(idx + 1).padStart(2, '0')}`,
            arc_stage: scene.arc_stage,
            camera: {
              shot_type: "medium_shot",
              orientation: "portrait",
              aspect_ratio: "4:5"
            },
            ambience: {
              mood: scene.emotion
            },
            subject: {
              characters_present: [{
                ...character
              }]
            },
            context: {
              location: scene.location
            },
            action_motion: scene.action,
            emotion: scene.emotion,
            voice_over: scene.voice_over || "",
            story_text_elements: storyTextElements,
            prompt_compact: promptString
          };
        })
      }
    };
    setGeneratedOutput(fullOutput);
    setIsOutdated(false);
    setActiveTab('results');
  };
  return React.createElement("div", {
    className: "min-h-screen pb-20"
  }, React.createElement("header", {
    className: "bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm"
  }, React.createElement("div", {
    className: "max-w-4xl mx-auto px-4 py-4 flex justify-between items-center"
  }, React.createElement("div", {
    className: "flex items-center gap-3"
  }, React.createElement("div", {
    className: "bg-indigo-600 text-white p-2 rounded-lg"
  }, React.createElement(Layers, {
    size: 24
  })), React.createElement("div", null, React.createElement("h1", {
    className: "text-xl font-bold text-gray-900 tracking-tight"
  }, "AMAN Engine"), React.createElement("p", {
    className: "text-xs text-gray-500 font-medium"
  }, "Knitted Storyboard JSON Generator"), React.createElement("p", {
    className: "text-[10px] text-gray-500"
  }, "\uD83D\uDCBE Progres otomatis tersimpan di browser ini"))), React.createElement("button", {
    onClick: generateJSON,
    className: "bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition flex items-center gap-2 shadow-lg"
  }, React.createElement(Code, {
    size: 18
  }), " Generate JSON Code"))), React.createElement("main", {
    className: "max-w-4xl mx-auto px-4 py-8"
  }, React.createElement("div", {
    className: "bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-1 mb-8 shadow-lg"
  }, React.createElement("div", {
    className: "bg-white rounded-lg p-6"
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, React.createElement(Sparkles, {
    className: "text-purple-600",
    size: 24
  }), React.createElement("h2", {
    className: "text-lg font-bold text-gray-800"
  }, "Magic Story Generator \u2728")), React.createElement("div", {
    className: "mb-6"
  }, React.createElement("label", {
    className: "block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"
  }, React.createElement(Palette, {
    size: 14
  }), " Pilih Gaya Visual (Image Type)"), React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
  }, VISUAL_STYLES.map(style => React.createElement("button", {
    key: style.id,
    onClick: () => setVisualStyle(style.id),
    className: `flex flex-col items-center justify-center p-3 rounded-xl border transition-all h-24 ${visualStyle === style.id ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50 text-gray-600'}`
  }, React.createElement(style.icon, {
    size: 24,
    className: "mb-2 opacity-80"
  }), React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wide text-center leading-tight"
  }, style.label)))), visualStyle === 'custom' && React.createElement("div", {
    className: "mt-3 animate-fade-in"
  }, React.createElement("label", {
    className: "block text-xs font-bold text-purple-600 uppercase mb-1"
  }, "Deskripsi Gaya Visual Sendiri"), React.createElement("textarea", {
    value: customStylePrompt || '',
    onChange: e => setCustomStylePrompt(e.target.value),
    className: "w-full border border-purple-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none bg-purple-50 h-20 resize-none",
    placeholder: "Contoh: Cyberpunk neon city, glowing lights, futuristic materials..."
  }))), React.createElement("div", {
    className: "flex flex-col gap-4"
  }, React.createElement("div", {
    className: "flex flex-col md:flex-row gap-3 items-start"
  }, React.createElement("div", {
    className: "w-full md:w-1/4"
  }, React.createElement("div", {
    className: "flex justify-between items-center mb-1"
  }, React.createElement("label", {
    className: "block text-xs font-bold text-gray-500 uppercase"
  }, "Jumlah Scene"), React.createElement("label", {
    className: "flex items-center gap-1 text-[10px] text-indigo-600 font-bold cursor-pointer"
  }, React.createElement("input", {
    type: "checkbox",
    checked: isAutoSceneCount,
    onChange: e => setIsAutoSceneCount(e.target.checked),
    className: "rounded text-indigo-600 focus:ring-indigo-500 w-3 h-3",
    disabled: isGeneratingStory
  }), "Auto (AI)")), isAutoSceneCount ? React.createElement("div", {
    className: "h-10 flex items-center justify-center bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-medium text-indigo-700 mt-2"
  }, "AI Menyesuaikan Cerita") : React.createElement(React.Fragment, null, React.createElement("input", {
    type: "range",
    "aria-label": "Jumlah scene",
    min: "1",
    max: "12",
    value: sceneCount || 5,
    onChange: e => setSceneCount(Number(e.target.value)),
    className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3",
    disabled: isGeneratingStory
  }), React.createElement("div", {
    className: "flex justify-between text-[10px] text-gray-500 px-1 mt-1"
  }, React.createElement("span", null, "1"), React.createElement("span", {
    className: "font-bold text-indigo-600"
  }, sceneCount), React.createElement("span", null, "12")))), React.createElement("div", {
    className: "w-full md:w-1/4"
  }, React.createElement("label", {
    className: "block text-xs font-bold text-gray-500 uppercase mb-1"
  }, "Genre Cerita"), React.createElement("select", {
    "aria-label": "Genre cerita",
    value: aiGenre || '',
    onChange: e => setAiGenre(e.target.value),
    className: "w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 text-gray-700 font-medium text-sm"
  }, STORY_GENRES.map(genre => React.createElement("option", {
    key: genre.id,
    value: genre.id
  }, genre.label))), aiGenre === 'custom' && React.createElement("input", {
    type: "text",
    "aria-label": "Genre kustom",
    value: customGenrePrompt || '',
    onChange: e => setCustomGenrePrompt(e.target.value),
    className: "w-full mt-2 h-10 border border-purple-300 rounded-lg px-3 focus:ring-2 focus:ring-purple-500 outline-none bg-purple-50 text-sm",
    placeholder: "Ketik Genre Sendiri..."
  })), React.createElement("div", {
    className: "flex-1 w-full"
  }, React.createElement("label", {
    className: "block text-xs font-bold text-gray-500 uppercase mb-1"
  }, "Topik Utama"), React.createElement("div", {
    className: "relative"
  }, React.createElement("input", {
    type: "text",
    "aria-label": "Topik utama",
    value: aiTopic || '',
    onChange: e => setAiTopic(e.target.value),
    placeholder: "Misal: Sedekah Subuh...",
    className: "w-full h-10 border border-gray-300 rounded-lg pl-3 pr-20 focus:ring-2 focus:ring-purple-500 outline-none text-sm",
    disabled: isGeneratingStory || isAnalyzingImage || isGeneratingTopicIdea
  }), React.createElement("div", {
    className: "absolute right-1 top-1 bottom-1 flex gap-1"
  }, React.createElement("button", {
    onClick: generateTopicIdea,
    disabled: isGeneratingStory || isAnalyzingImage || isGeneratingTopicIdea,
    className: "px-2 bg-purple-50 hover:bg-purple-200 text-purple-600 rounded flex items-center justify-center transition disabled:opacity-50",
    title: "Dapatkan Ide Topik dari AI"
  }, isGeneratingTopicIdea ? React.createElement(Loader2, {
    size: 16,
    className: "animate-spin"
  }) : React.createElement(Lightbulb, {
    size: 16
  })), React.createElement("button", {
    onClick: () => fileInputRef.current.click(),
    disabled: isGeneratingStory || isAnalyzingImage || isGeneratingTopicIdea,
    className: "px-2 bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 rounded flex items-center justify-center transition disabled:opacity-50",
    title: "Upload gambar referensi (bisa lebih dari satu)"
  }, React.createElement(Upload, {
    size: 16
  }))), React.createElement("input", {
    type: "file",
    multiple: true,
    ref: fileInputRef,
    onChange: handleImageSelect,
    accept: "image/*",
    className: "hidden"
  })), uploadedImages.length > 0 && React.createElement("div", {
    className: "mt-2 bg-indigo-50 border border-indigo-100 p-3 rounded-lg animate-fade-in shadow-sm"
  }, React.createElement("div", {
    className: "flex justify-between items-center mb-2"
  }, React.createElement("span", {
    className: "text-xs text-indigo-800 font-bold"
  }, uploadedImages.length, " Gambar Referensi Siap"), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: analyzeImageForTopic,
    disabled: isAnalyzingImage,
    className: "bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1 transition disabled:opacity-50",
    title: "Analisa gambar untuk membuat Topik Utama"
  }, isAnalyzingImage ? React.createElement(Loader2, {
    size: 12,
    className: "animate-spin"
  }) : React.createElement(Sparkles, {
    size: 12
  }), isAnalyzingImage ? 'Menganalisa...' : 'Analisa Topik'), React.createElement("button", {
    onClick: clearUploadedImages,
    disabled: isAnalyzingImage,
    className: "text-red-500 hover:bg-red-100 p-1.5 rounded-md transition disabled:opacity-50 border border-transparent hover:border-red-200",
    title: "Hapus Semua Gambar"
  }, React.createElement(Trash2, {
    size: 14
  })))), React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, uploadedImages.map(img => React.createElement("div", {
    key: img.id,
    className: "relative group"
  }, React.createElement("img", {
    src: img.preview,
    alt: "Upload Preview",
    className: "w-12 h-12 object-cover rounded shadow-sm border border-indigo-200"
  }), React.createElement("button", {
    onClick: () => removeUploadedImage(img.id),
    disabled: isAnalyzingImage,
    className: "absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 hidden group-hover:block shadow"
  }, React.createElement(X, {
    size: 12
  }))))), isAnalyzingImage && React.createElement("span", {
    className: "text-[10px] font-bold text-indigo-600 animate-pulse mt-2 block"
  }, "AI sedang menganalisa referensi visual...")))), React.createElement("textarea", {
    value: userInstructions || '',
    onChange: e => setUserInstructions(e.target.value),
    placeholder: "Catatan / Instruksi Khusus untuk AI (Contoh: 'Buat endingnya plot twist')...",
    className: "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-none",
    disabled: isGeneratingStory
  }), React.createElement("button", {
    onClick: generateStoryWithAI,
    disabled: isGeneratingStory || !aiTopic.trim() || isAnalyzingImage || isGeneratingTopicIdea,
    className: "w-full sparkl-btn bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 disabled:opacity-50 transition shadow-md"
  }, isGeneratingStory ? React.createElement("span", {
    className: "loading-ring"
  }) : React.createElement(Sparkles, {
    size: 18
  }), isGeneratingStory ? 'Sedang Membuat Cerita...' : 'Buat Cerita Otomatis')), aiError && React.createElement("div", {
    className: "mt-3 bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100"
  }, aiError))), React.createElement("div", {
    className: "flex gap-6 mb-6 border-b border-gray-200"
  }, React.createElement("button", {
    onClick: () => setActiveTab('input'),
    className: `pb-3 px-1 font-semibold text-sm transition border-b-2 ${activeTab === 'input' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`
  }, "1. Input Data"), React.createElement("button", {
    onClick: () => setActiveTab('results'),
    className: `pb-3 px-1 font-semibold text-sm transition border-b-2 ${activeTab === 'results' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`,
    disabled: !generatedOutput
  }, "2. JSON Result"), React.createElement("button", {
    onClick: () => setActiveTab('video'),
    className: `pb-3 px-1 font-semibold text-sm transition border-b-2 flex items-center gap-1 ${activeTab === 'video' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`,
    disabled: !generatedOutput
  }, React.createElement(Film, {
    size: 16
  }), " 3. Video Prompt")), activeTab === 'input' ? React.createElement("div", {
    className: "space-y-8 animate-fade-in"
  }, nameChangeNotice && React.createElement("div", {
    className: "bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm animate-fade-in"
  }, React.createElement("div", {
    className: "flex items-center gap-3 text-amber-800"
  }, React.createElement("div", {
    className: "bg-amber-100 p-2 rounded-full"
  }, React.createElement(RefreshCw, {
    size: 18
  })), React.createElement("p", {
    className: "text-sm font-semibold"
  }, "Nama karakter diubah dari \"", nameChangeNotice.oldName, "\" menjadi \"", character.name, "\". Teks Aksi/Narasi di scene yang sudah ada mungkin masih menyebut nama lama.")), React.createElement("div", {
    className: "flex gap-2 whitespace-nowrap"
  }, React.createElement("button", {
    onClick: applyNameSync,
    className: "bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm"
  }, "Ganti Otomatis di Teks Scene"), React.createElement("button", {
    onClick: dismissNameChangeNotice,
    className: "text-amber-700 text-sm font-semibold px-3 py-2 hover:bg-amber-100 rounded-lg transition"
  }, "Abaikan"))), React.createElement("div", {
    className: "flex justify-end items-center gap-3 text-xs font-semibold"
  }, React.createElement("button", {
    onClick: () => setExpandedInputSections({}),
    className: "text-indigo-600 hover:underline"
  }, "Buka Semua"), React.createElement("span", {
    className: "text-gray-300"
  }, "|"), React.createElement("button", {
    onClick: () => {
      const allClosed = {
        character: false,
        metadata: false
      };
      scenes.forEach((_, i) => {
        allClosed[i] = false;
      });
      setExpandedInputSections(allClosed);
    },
    className: "text-indigo-600 hover:underline"
  }, "Tutup Semua")), React.createElement("section", {
    className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
  }, React.createElement("div", {
    className: "flex items-center justify-between p-6 pb-4 gap-2"
  }, React.createElement("button", {
    onClick: () => toggleInputSectionExpanded('character'),
    className: "flex-1 min-w-0 text-left flex items-center gap-2"
  }, React.createElement("span", {
    className: `inline-block transition-transform text-gray-500 ${isInputSectionOpen('character') ? 'rotate-90' : ''}`
  }, "\u25B6"), React.createElement(User, {
    size: 18,
    className: "text-gray-500 shrink-0"
  }), React.createElement("h2", {
    className: "font-semibold text-gray-800 truncate"
  }, "Character Bible: ", character.name || '')), React.createElement("button", {
    onClick: autoGenerateCharacter,
    disabled: isGeneratingCharacter || isGeneratingStory,
    className: "text-[11px] bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm border border-purple-200 shrink-0",
    title: "AI akan merancang detail pakaian dan warna sesuai Topik Utama"
  }, isGeneratingCharacter ? React.createElement(Loader2, {
    size: 12,
    className: "animate-spin"
  }) : React.createElement(Sparkles, {
    size: 12
  }), "\u2728 Auto-Desain Karakter")), isInputSectionOpen('character') && React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6 pt-4 border-t"
  }, React.createElement("div", null, React.createElement("label", {
    className: "text-xs font-bold text-gray-500 uppercase"
  }, "Nama"), React.createElement("input", {
    type: "text",
    "aria-label": "Nama karakter",
    value: character.name || '',
    onFocus: () => {
      nameBeforeEditRef.current = character.name;
    },
    onBlur: () => notifyIfNameStillUsedInScenes(nameBeforeEditRef.current, character.name),
    onChange: e => setCharacter({
      ...character,
      name: e.target.value
    }),
    className: "w-full border rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "text-xs font-bold text-gray-500 uppercase"
  }, "Outfit"), React.createElement("input", {
    type: "text",
    "aria-label": "Outfit karakter",
    value: character.outfit[0] || '',
    onChange: e => {
      const newO = [...character.outfit];
      newO[0] = e.target.value;
      setCharacter({
        ...character,
        outfit: newO
      });
    },
    className: "w-full border rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
  })))), React.createElement("section", {
    className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden border-l-4 border-l-purple-500"
  }, React.createElement("button", {
    onClick: () => toggleInputSectionExpanded('metadata'),
    className: "w-full text-left flex items-center gap-2 p-6 pb-4"
  }, React.createElement("span", {
    className: `inline-block transition-transform text-purple-600 ${isInputSectionOpen('metadata') ? 'rotate-90' : ''}`
  }, "\u25B6"), React.createElement(Share, {
    size: 18,
    className: "text-purple-600"
  }), React.createElement("h2", {
    className: "font-semibold text-gray-800"
  }, "Metadata & Pengaturan Global")), isInputSectionOpen('metadata') && React.createElement("div", {
    className: "space-y-4 px-6 pb-6 pt-4 border-t"
  }, React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, React.createElement("div", {
    className: "md:col-span-2"
  }, React.createElement("label", {
    className: "block text-xs font-bold text-gray-500 uppercase mb-1"
  }, "Default Watermark Konten"), React.createElement("input", {
    type: "text",
    "aria-label": "Watermark",
    value: globalWatermark || '',
    onChange: e => setGlobalWatermark(e.target.value),
    className: "w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none text-gray-700 font-medium",
    placeholder: "@adya.vision"
  }), React.createElement("p", {
    className: "text-[10px] text-gray-500 mt-1"
  }, "Teks ini akan otomatis ditambahkan ke setiap scene baru sebagai teks di pojok bawah.")), React.createElement("div", {
    className: "md:col-span-2"
  }, React.createElement("label", {
    className: "block text-xs font-bold text-gray-500 uppercase mb-1"
  }, "Deskripsi"), React.createElement("textarea", {
    rows: "3",
    "aria-label": "Deskripsi cerita",
    value: storyMetadata.description || '',
    onChange: e => setStoryMetadata({
      ...storyMetadata,
      description: e.target.value
    }),
    className: "w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-xs font-bold text-gray-500 uppercase mb-1"
  }, "Tagar"), React.createElement("input", {
    type: "text",
    "aria-label": "Tagar",
    value: storyMetadata.hashtags || '',
    onChange: e => setStoryMetadata({
      ...storyMetadata,
      hashtags: e.target.value
    }),
    className: "w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none text-blue-600 font-medium"
  })), React.createElement("div", null, React.createElement("label", {
    className: "block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"
  }, React.createElement(FileText, {
    size: 12
  }), " Saran Strategi"), React.createElement("textarea", {
    rows: "2",
    "aria-label": "Saran strategi",
    value: storyMetadata.notes || '',
    onChange: e => setStoryMetadata({
      ...storyMetadata,
      notes: e.target.value
    }),
    className: "w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none bg-yellow-50 text-gray-600"
  }))))), React.createElement("div", {
    className: "space-y-6"
  }, scenes.map((scene, idx) => {
    const isOpen = isInputSectionOpen(idx);
    return React.createElement("section", {
      key: scene.id,
      className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    }, React.createElement("div", {
      className: "bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center gap-3"
    }, React.createElement("button", {
      onClick: () => toggleInputSectionExpanded(idx),
      className: "flex-1 min-w-0 text-left flex items-center gap-2"
    }, React.createElement("span", {
      className: `inline-block transition-transform text-gray-500 shrink-0 ${isOpen ? 'rotate-90' : ''}`
    }, "\u25B6"), React.createElement(Image, {
      size: 18,
      className: "text-gray-500 shrink-0"
    }), React.createElement("h2", {
      className: "font-semibold text-gray-800 truncate"
    }, "Scene ", idx + 1, !isOpen && scene.action && React.createElement("span", {
      className: "text-gray-500 font-normal text-sm"
    }, " \u2014 ", scene.action.slice(0, 60), scene.action.length > 60 ? '…' : ''))), React.createElement("div", {
      className: "flex gap-2 shrink-0"
    }, React.createElement("input", {
      type: "text",
      "aria-label": "Tahap arc scene",
      value: scene.arc_stage || '',
      onChange: e => updateScene(idx, 'arc_stage', e.target.value),
      className: "text-xs border rounded px-2 py-1 w-24",
      placeholder: "Stage"
    }), scenes.length > 1 && React.createElement("button", {
      onClick: () => {
        const newScenes = scenes.filter((_, i) => i !== idx);
        setScenes(newScenes);
      },
      "aria-label": "Hapus scene",
      className: "text-red-400 hover:text-red-500"
    }, React.createElement(Trash2, {
      size: 18
    })))), isOpen && React.createElement("div", {
      className: "p-6 space-y-4"
    }, React.createElement("div", null, React.createElement("label", {
      className: "block text-xs font-bold text-gray-500 uppercase mb-1"
    }, "Aksi"), React.createElement("textarea", {
      rows: "2",
      "aria-label": "Aksi scene",
      value: scene.action || '',
      onChange: e => updateScene(idx, 'action', e.target.value),
      className: "w-full border rounded p-2 text-sm"
    })), React.createElement("div", {
      className: "grid grid-cols-2 gap-4"
    }, React.createElement("div", null, React.createElement("label", {
      className: "block text-xs font-bold text-gray-500 uppercase mb-1"
    }, "Lokasi"), React.createElement("input", {
      type: "text",
      "aria-label": "Lokasi scene",
      value: scene.location || '',
      onChange: e => updateScene(idx, 'location', e.target.value),
      className: "w-full border rounded p-2 text-sm"
    })), React.createElement("div", null, React.createElement("label", {
      className: "block text-xs font-bold text-gray-500 uppercase mb-1"
    }, "Emosi"), React.createElement("input", {
      type: "text",
      "aria-label": "Emosi scene",
      value: scene.emotion || '',
      onChange: e => updateScene(idx, 'emotion', e.target.value),
      className: "w-full border rounded p-2 text-sm"
    }))), React.createElement("div", {
      className: "bg-purple-50 rounded-lg p-4 border border-purple-100"
    }, React.createElement("div", {
      className: "flex justify-between items-center mb-2"
    }, React.createElement("label", {
      className: "text-xs font-bold text-purple-900 uppercase"
    }, "\uD83C\uDF99\uFE0F Voice Over (Narasi Suara)"), React.createElement("button", {
      onClick: () => autoGenerateVoiceOver(idx),
      disabled: !!generatingVoiceOverFor[idx],
      className: "text-[10px] bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold px-2 py-1 rounded flex items-center gap-1 transition disabled:opacity-50",
      title: "AI akan membuat naskah voice over berdasarkan Aksi scene ini"
    }, generatingVoiceOverFor[idx] ? React.createElement(Loader2, {
      size: 10,
      className: "animate-spin"
    }) : React.createElement(Sparkles, {
      size: 10
    }), " Auto (AI)")), React.createElement("textarea", {
      rows: "2",
      "aria-label": "Voice over scene",
      value: scene.voice_over || '',
      onChange: e => updateScene(idx, 'voice_over', e.target.value),
      placeholder: "Naskah yang akan dibacakan narator untuk scene ini...",
      className: "w-full border border-purple-200 rounded p-2 text-sm bg-white focus:ring-1 focus:ring-purple-500 outline-none"
    })), React.createElement("div", {
      className: "bg-indigo-50 rounded-lg p-4 border border-indigo-100"
    }, React.createElement("div", {
      className: "flex justify-between mb-2"
    }, React.createElement("label", {
      className: "text-xs font-bold text-indigo-900 uppercase"
    }, "Teks (Indo)"), React.createElement("button", {
      onClick: () => addTextToScene(idx),
      className: "text-xs bg-white border px-2 py-1 rounded flex items-center gap-1"
    }, React.createElement(Plus, {
      size: 12
    }), " Add")), React.createElement("div", {
      className: "space-y-2"
    }, scene.texts.map((text, tIdx) => React.createElement("div", {
      key: tIdx,
      className: "flex gap-2 items-center"
    }, React.createElement("div", {
      className: "flex-1 flex gap-2"
    }, React.createElement("select", {
      "aria-label": "Peran teks",
      value: text.role || '',
      onChange: e => updateTextElement(idx, tIdx, 'role', e.target.value),
      className: "w-1/3 text-sm border rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
    }, TEXT_ROLES.map(role => React.createElement("option", {
      key: role.id,
      value: role.id
    }, role.label))), text.role === 'custom' && React.createElement("input", {
      type: "text",
      "aria-label": "Nama role kustom",
      value: text.customLabel || '',
      onChange: e => updateTextElement(idx, tIdx, 'customLabel', e.target.value),
      className: "w-1/3 text-sm border rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none border-blue-300 bg-blue-50",
      placeholder: "Nama Role Sendiri"
    }), React.createElement("input", {
      type: "text",
      "aria-label": "Isi teks",
      value: text.content || '',
      onChange: e => updateTextElement(idx, tIdx, 'content', e.target.value),
      className: `flex-1 text-sm border rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none ${text.role === 'watermark' ? 'text-gray-500 font-mono' : ''}`,
      placeholder: "Isi Teks..."
    })), React.createElement("button", {
      onClick: () => removeTextElement(idx, tIdx),
      "aria-label": "Hapus teks",
      className: "text-red-400 hover:text-red-600 transition"
    }, React.createElement(Trash2, {
      size: 16
    }))))))));
  }), React.createElement("button", {
    onClick: addScene,
    className: "w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 flex justify-center items-center gap-2"
  }, React.createElement(Plus, {
    size: 20
  }), " Add Scene"))) : activeTab === 'results' ? React.createElement("div", {
    className: "space-y-8 animate-fade-in"
  }, isOutdated && React.createElement("div", {
    className: "bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm animate-fade-in"
  }, React.createElement("div", {
    className: "flex items-center gap-3 text-amber-800"
  }, React.createElement("div", {
    className: "bg-amber-100 p-2 rounded-full"
  }, React.createElement(RefreshCw, {
    size: 18
  })), React.createElement("p", {
    className: "text-sm font-semibold"
  }, "Terdapat perubahan di Input Data! Silakan Generate ulang agar JSON ter-update.")), React.createElement("button", {
    onClick: generateJSON,
    className: "bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm flex items-center gap-2 whitespace-nowrap"
  }, React.createElement(RefreshCw, {
    size: 16
  }), " Generate Ulang JSON")), React.createElement("div", {
    className: "flex justify-end items-center gap-3 text-xs font-semibold"
  }, React.createElement("button", {
    onClick: () => {
      const allKeys = {
        metadata: true,
        character: true
      };
      generatedOutput.character_bible_and_scenes.scenes.forEach((_, i) => {
        allKeys[i] = true;
      });
      setExpandedSections(allKeys);
    },
    className: "text-indigo-600 hover:underline"
  }, "Buka Semua"), React.createElement("span", {
    className: "text-gray-300"
  }, "|"), React.createElement("button", {
    onClick: () => setExpandedSections({}),
    className: "text-indigo-600 hover:underline"
  }, "Tutup Semua")), React.createElement("div", {
    className: "bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
  }, React.createElement("div", {
    className: "bg-purple-900 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
  }, React.createElement("button", {
    onClick: () => toggleSectionExpanded('metadata'),
    className: "flex-1 text-left flex items-center gap-2 text-white hover:opacity-80 transition"
  }, React.createElement("span", {
    className: `inline-block transition-transform text-purple-300 ${expandedSections['metadata'] ? 'rotate-90' : ''}`
  }, "\u25B6"), React.createElement(Share, {
    size: 18,
    className: "text-purple-300"
  }), React.createElement("h2", {
    className: "font-bold"
  }, "Metadata")), React.createElement("div", {
    className: "flex gap-2"
  }, React.createElement("button", {
    onClick: optimizeCaption,
    disabled: isOptimizingCaption || !storyMetadata.description,
    className: "text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1 border border-purple-400",
    title: "Tulis ulang caption agar lebih viral menggunakan AI"
  }, isOptimizingCaption ? React.createElement(Loader2, {
    size: 12,
    className: "animate-spin"
  }) : React.createElement(Sparkles, {
    size: 12
  }), "\u2728 Rewrite Viral"), React.createElement(CopyButton, {
    text: `${storyMetadata.description}\n\n${storyMetadata.hashtags}\n\n[Catatan]: ${storyMetadata.notes}`
  }))), expandedSections['metadata'] && React.createElement("div", {
    className: "bg-gray-800 p-6 text-sm text-purple-200 font-mono leading-relaxed code-block border-t border-purple-700"
  }, React.createElement("p", {
    className: "mb-4"
  }, React.createElement("span", {
    className: "text-gray-500"
  }, "// Deskripsi"), React.createElement("br", null), storyMetadata.description), React.createElement("p", {
    className: "mb-4"
  }, React.createElement("span", {
    className: "text-gray-500"
  }, "// Tagar"), React.createElement("br", null), storyMetadata.hashtags), React.createElement("p", null, React.createElement("span", {
    className: "text-gray-500"
  }, "// Catatan"), React.createElement("br", null), storyMetadata.notes))), React.createElement("div", {
    className: "bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
  }, React.createElement("div", {
    className: "bg-indigo-900 px-6 py-4 flex justify-between items-center"
  }, React.createElement("button", {
    onClick: () => toggleSectionExpanded('character'),
    className: "flex-1 text-left flex items-center gap-2 text-white hover:opacity-80 transition"
  }, React.createElement("span", {
    className: `inline-block transition-transform text-indigo-300 ${expandedSections['character'] ? 'rotate-90' : ''}`
  }, "\u25B6"), React.createElement(BookOpen, {
    size: 18,
    className: "text-indigo-300"
  }), React.createElement("h2", {
    className: "font-bold"
  }, "Character")), React.createElement(CopyButton, {
    text: JSON.stringify(generatedOutput.character_bible_and_scenes.character_bible[0], null, 2)
  })), expandedSections['character'] && React.createElement("div", {
    className: "bg-gray-800 p-0 overflow-x-auto code-block border-t border-indigo-700"
  }, React.createElement("pre", {
    className: "text-xs md:text-sm text-indigo-200 font-mono p-6 leading-relaxed"
  }, JSON.stringify(generatedOutput.character_bible_and_scenes.character_bible[0], null, 2)))), generatedOutput.character_bible_and_scenes.scenes.map((scene, idx) => {
    const isExpanded = !!expandedSections[idx];
    return React.createElement("div", {
      key: idx,
      className: "bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
    }, React.createElement("div", {
      className: "bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center"
    }, React.createElement("button", {
      onClick: () => toggleSectionExpanded(idx),
      className: "flex-1 text-left flex items-center gap-2 text-white hover:opacity-80 transition"
    }, React.createElement("span", {
      className: `inline-block transition-transform text-green-400 ${isExpanded ? 'rotate-90' : ''}`
    }, "\u25B6"), React.createElement(Code, {
      size: 18,
      className: "text-green-400"
    }), React.createElement("h2", {
      className: "font-bold"
    }, "Scene ", idx + 1, " ", React.createElement("span", {
      className: "text-gray-500 font-normal text-sm"
    }, "\u2014 ", scene.arc_stage))), React.createElement(CopyButton, {
      text: JSON.stringify(scene, null, 2)
    })), isExpanded && React.createElement("div", {
      className: "bg-gray-800 p-0 overflow-x-auto code-block"
    }, React.createElement("pre", {
      className: "text-xs md:text-sm text-green-300 font-mono p-6 leading-relaxed"
    }, JSON.stringify(scene, null, 2))));
  })) : activeTab === 'video' ? React.createElement("div", {
    className: "space-y-8 animate-fade-in"
  }, isOutdated && React.createElement("div", {
    className: "bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm animate-fade-in"
  }, React.createElement("div", {
    className: "flex items-center gap-3 text-amber-800"
  }, React.createElement("div", {
    className: "bg-amber-100 p-2 rounded-full"
  }, React.createElement(RefreshCw, {
    size: 18
  })), React.createElement("p", {
    className: "text-sm font-semibold"
  }, "Terdapat perubahan di Input Data! Silakan ", React.createElement("strong", null, "Generate Ulang JSON"), " agar prompt video ter-update.")), React.createElement("button", {
    onClick: generateJSON,
    className: "bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm flex items-center gap-2 whitespace-nowrap"
  }, React.createElement(RefreshCw, {
    size: 16
  }), " Generate Ulang JSON")), React.createElement("div", {
    className: "bg-blue-50 border border-blue-200 p-5 rounded-xl shadow-sm"
  }, React.createElement("div", {
    className: "flex items-start gap-3"
  }, React.createElement("div", {
    className: "bg-blue-100 p-2 rounded-lg text-blue-600 mt-1"
  }, React.createElement(Film, {
    size: 20
  })), React.createElement("div", {
    className: "flex-1"
  }, React.createElement("h3", {
    className: "text-sm font-bold text-blue-900 mb-1"
  }, "Prompt Video AI (Luma / Runway / Kling)"), React.createElement("p", {
    className: "text-xs text-blue-700"
  }, "Gunakan instruksi teks di bawah ini bersama dengan gambar yang telah Anda render (fitur Image-to-Video) pada platform AI Video Generator untuk mendapatkan hasil animasi yang mulus dan konsisten.")))), React.createElement("div", {
    className: "flex justify-between items-center gap-3 flex-wrap"
  }, React.createElement("div", {
    className: "flex items-center gap-2 bg-purple-900 rounded-lg px-3 py-2"
  }, React.createElement("span", {
    className: "text-xs font-bold text-purple-200"
  }, "\uD83C\uDF99\uFE0F Naskah Voice Over Lengkap (semua scene)"), React.createElement(CopyButton, {
    text: generatedOutput.character_bible_and_scenes.scenes.map(s => s.voice_over).filter(Boolean).join('\n\n')
  })), React.createElement("div", {
    className: "flex items-center gap-3 text-xs font-semibold"
  }, React.createElement("button", {
    onClick: () => setExpandedVideoPrompts(Object.fromEntries(generatedOutput.character_bible_and_scenes.scenes.map((_, i) => [i, true]))),
    className: "text-indigo-600 hover:underline"
  }, "Buka Semua"), React.createElement("span", {
    className: "text-gray-300"
  }, "|"), React.createElement("button", {
    onClick: () => setExpandedVideoPrompts({}),
    className: "text-indigo-600 hover:underline"
  }, "Tutup Semua"))), React.createElement("div", {
    className: "grid grid-cols-1 gap-6"
  }, generatedOutput.character_bible_and_scenes.scenes.map((scene, idx) => {
    let stylePrompt = "";
    if (visualStyle === 'custom') {
      stylePrompt = customStylePrompt;
    } else {
      stylePrompt = VISUAL_STYLES.find(s => s.id === visualStyle)?.prompt || "Knitted felt style";
    }
    const videoPrompt = `Subtle cinematic motion, slow pan. ${character.name} (${character.outfit[0] || 'outfit'}), faceless. ${scene.action_motion}. Setting: ${scene.context.location}. Visual Style: ${stylePrompt}. Maintain consistent character, high quality, smooth animation.`;
    const isExpanded = !!expandedVideoPrompts[idx];
    return React.createElement("div", {
      key: scene.scene_id,
      className: "bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
    }, React.createElement("div", {
      className: "bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center"
    }, React.createElement("button", {
      onClick: () => toggleVideoPromptExpanded(idx),
      className: "flex-1 text-left flex items-center gap-2 text-white hover:opacity-80 transition"
    }, React.createElement("span", {
      className: `inline-block transition-transform text-blue-400 ${isExpanded ? 'rotate-90' : ''}`
    }, "\u25B6"), React.createElement(Film, {
      size: 18,
      className: "text-blue-400"
    }), React.createElement("h2", {
      className: "font-bold"
    }, "Scene ", idx + 1, " - Video Prompt")), React.createElement(CopyButton, {
      text: videoPrompt
    })), isExpanded && React.createElement("div", {
      className: "bg-gray-800 p-6 text-sm text-blue-200 font-mono leading-relaxed"
    }, videoPrompt), scene.voice_over && React.createElement("div", {
      className: "bg-purple-50 border-t border-purple-100 px-6 py-4"
    }, React.createElement("div", {
      className: "flex justify-between items-center mb-1"
    }, React.createElement("span", {
      className: "text-xs font-bold text-purple-900 uppercase"
    }, "\uD83C\uDF99\uFE0F Voice Over"), React.createElement(CopyButton, {
      text: scene.voice_over
    })), React.createElement("p", {
      className: "text-sm text-purple-800"
    }, scene.voice_over)));
  }))) : null));
}
function CopyButton({
  text
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
    document.body.removeChild(textarea);
  };
  return React.createElement("button", {
    onClick: handleCopy,
    className: `text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`
  }, copied ? React.createElement(Check, {
    size: 14
  }) : React.createElement(Copy, {
    size: 14
  }), " ", copied ? 'Copied!' : 'Copy');
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));