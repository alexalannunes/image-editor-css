import { useState } from 'react';

import './App.css';
import { useRef } from 'react';
import { editorControls } from './controls';
import { RangeControl } from './input-control';

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


function App() {
  const [r, s] = useState('');
  const [edit, setEdit] = useState(editorControls);
  const [fileName, setFileName] = useState('')

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

            const fileInput = e.target.files[0]

            setFileName(fileInput.name)


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
            <RangeControl
              key={prop}
              label={label}
              value={value}
              max={max}
              min={min}
              step={step}
              disabled={!r}
              onChange={(newValue) => {
                setEdit(prev => {
                  return prev.map(o => {
                    if (o.prop === option.prop) {
                      return {
                        ...o,
                        value: (newValue)
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

            downloadImage(result, fileName || 'new image');
          }
        }}
      >
        download
      </button>
    </>
  );
}

export default App;
