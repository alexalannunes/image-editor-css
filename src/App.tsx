import { useState } from 'react';

import './App.css';
import { useRef } from 'react';

function downloadImage(image: string, imageFileName: string) {
  const fakeLink = document.createElement('a');
  fakeLink.style.display = 'none';
  fakeLink.download = imageFileName;
  fakeLink.href = image;
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
  fakeLink.remove();
}

function Range({
  value,
  onChange,
  label,
  step = 0.01,
  min = 0,
  max = 1,
}: {
  label: string;
  value: number;
  step?: number;
  min?: number;
  max?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      {label}
      <input
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        type="range"
      />
      <input
        value={value}
        type="number"
        max={max}
        min={min}
        step={step}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        style={{ width: 50 }}
      />
    </div>
  );
}

function App() {
  const [r, s] = useState('');
  // https://www.w3schools.com/cssref/css3_pr_filter.php more filters
  const [edit, setEdit] = useState({
    brightness: 1,
    grayscale: 0,
    saturate: 1,
    sepia: 0,
  });
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <h1>Vite + React</h1>

      <hr />

      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          if (e.target.files?.length) {
            const file = new FileReader();

            console.log(e.target.files[0]);

            file.onload = (ev) => {
              console.log(ev);
              s(ev.target?.result as string);
            };

            file.readAsDataURL(e.target.files[0]);
          }
        }}
      />

      <hr />

      <div>image goes here...</div>
      <div ref={ref}>
        {r && (
          <img
            width="200"
            src={r}
            alt="minha img"
            style={{
              filter: `brightness(${edit.brightness}) grayscale(${edit.grayscale}) saturate(${edit.saturate}) sepia(${edit.sepia})`,
            }}
            id="my-img"
            onLoad={(e) => {
              const target = e.target as HTMLImageElement;
              console.log((e.target as any).width, (e.target as any).height);
              if (canvasRef.current) {
                canvasRef.current.width = target.width;
                canvasRef.current.height = target.height;
              }
            }}
          />
        )}
      </div>
      <hr />

      {['brightness', 'grayscale', 'saturate', 'sepia'].map((io) => {
        const key = io as keyof typeof edit;
        return (
          <Range
            key={io}
            label={io}
            value={edit[key]}
            max={5}
            onChange={(v) => {
              setEdit((prev) => ({
                ...prev,
                [key]: Number(v),
              }));
            }}
          />
        );
      })}

      <canvas ref={canvasRef} style={{ display: 'none' }} id="img"></canvas>

      <hr />
      <button
        onClick={() => {
          // TODO canvas ref
          var canvas = document.getElementById('img') as HTMLCanvasElement;
          var ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.filter = `brightness(${edit.brightness}) grayscale(${edit.grayscale}) saturate(${edit.saturate}) sepia(${edit.sepia})`;
            var img = document.getElementById('my-img') as HTMLImageElement;

            if (img) {
              // TODO put image size
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            const result = canvas.toDataURL('image/jpeg');

            downloadImage(result, 'new image');
          }
        }}
      >
        download
      </button>
    </>
  );
}

export default App;
