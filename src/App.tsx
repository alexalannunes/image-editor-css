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

const editorOptions = [{
  label: 'Brightness',
  prop: 'brightness',
  min: 0,
  max: 5,
  step: 0.01,
  value: 1,
  unit: ''
}, {
  label: 'Grayscale',
  prop: 'grayscale',
  min: 0,
  max: 1,
  step: 0.01,
  value: 0,
  unit: ''
}, {
  label: 'Saturate',
  prop: 'Saturate',
  min: 0,
  max: 5,
  step: 0.01,
  value: 1,
  unit: ''
}, {
  label: 'Sepia',
  prop: 'sepia',
  min: 0,
  max: 1,
  step: 0.01,
  value: 0,
  unit: ''
}, {
  label: 'Blur',
  prop: 'blur',
  min: 0,
  max: 5,
  step: 0.02,
  value: 0,
  unit: 'px'
}]

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
  const [edit, setEdit] = useState(editorOptions);

  console.log(edit)
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filterValue = edit.reduce((acc, option) => {
    return acc + `${option.prop}(${option.value}${option.unit}) `;
  }, '')


  return (
    <>
      <h1>Image Editor</h1>

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
              filter: filterValue,
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

      {
        edit.map(option => {
          const { label, prop, min, max, step, value } = option
          return (
            <Range
              key={prop}
              label={label}
              value={value}
              max={max}
              min={min}
              step={step}
              onChange={(newValue) => {
                setEdit(prev => {
                  return prev.map(o => {
                    if (o.prop === option.prop) {
                      return {
                        ...o,
                        value: Number(newValue)
                      }
                    }
                    return o
                  })
                })
              }}
            />
          )
        })
      }


      <canvas ref={canvasRef} style={{ display: 'none' }} id="img"></canvas>

      <hr />
      <button
        disabled={!r}
        onClick={() => {
          // TODO canvas ref
          var canvas = document.getElementById('img') as HTMLCanvasElement;
          var ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.filter = filterValue;
            var img = document.getElementById('my-img') as HTMLImageElement;

            if (img) {
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
