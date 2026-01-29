
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function App() {
  const [santo, setSanto] = useState('');
  const [bisogno, setBisogno] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleGenerate = async () => {
    if (!bisogno) return;
    
    setLoading(true);
    setContent(''); // Clear previous content
    
    try {
      // Adjusted instruction for real-time user interaction
      const systemInstruction = `Sei l'Architetto Spirituale di "Studio Pura Luce". Rispondi a un fedele che cerca conforto.
      
STILE:
- Austero, solenne, privo di sentimentalismi moderni.
- Usa lessico liturgico e pesante (Pietra, Sangue, Verità, Silenzio).
- Nessuna premessa ("Ecco la tua preghiera"), genera SOLO il contenuto finale.

STRUTTURA MARKDOWN:
# [Titolo Solenne basato sul bisogno]
[Breve introduzione teologica sul Santo invocato e il suo legame con questo dolore specifico]

## Il Segno
[Descrizione simbolica: un oggetto, un gesto, o un elemento iconografico del Santo che diventa metafora della soluzione]

## L'Orazione
> [Inserisci qui la preghiera. Deve essere in blockquote. Stile imperativo, forte, una richiesta di forza più che di grazia.]

## Rito Quotidiano
[Lista puntata di 3 azioni concrete e brevi che l'utente deve compiere]

### [Call to Action breve e criptica]
[Invito a scoprire un oggetto fisico di Studio Pura Luce che funge da 'ancora' per questa preghiera]`;

      const userPrompt = `Il fedele chiede aiuto per: "${bisogno}".
      ${santo ? `Si rivolge in particolare a: ${santo}.` : 'Scegli tu il Santo più adatto a questa tribolazione.'}
      
      Genera la pagina di risposta.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        }
      });

      setContent(response.text);
      
      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (error) {
      console.error("Errore generazione:", error);
      setContent(`# Errore nel Santuario\n\nLe voci sono confuse. Riprova più tardi.\n\n*${error.message}*`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      
      {/* Navigation / Brand */}
      <nav className="w-full py-8 border-b border-stone-900 flex justify-center bg-stone-950/80 backdrop-blur-sm fixed top-0 z-50">
        <div className="text-center space-y-1">
          <h1 className="brand text-2xl tracking-[0.2em] text-amber-700/80 uppercase">Studio Pura Luce</h1>
          <p className="text-[10px] tracking-[0.4em] text-stone-600 uppercase font-sans">Santuario & Artificio</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl px-6 pt-32 pb-24 flex-grow flex flex-col items-center">
        
        {/* Intro Section */}
        {!content && !loading && (
          <div className="text-center space-y-6 mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl text-stone-200 leading-tight">
              La fede è un atto<br/>di <span className="text-amber-800 italic font-serif">volontà</span>.
            </h2>
            <p className="text-stone-500 max-w-md mx-auto leading-relaxed">
              Non cercare consolazioni effimere. Cerca la pietra su cui edificare. 
              Descrivi il tuo tormento, e ricevi l'orazione adatta alla tua battaglia.
            </p>
          </div>
        )}

        {/* Input Form */}
        <div className={`w-full transition-all duration-700 ${content ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="space-y-8 bg-stone-900/30 p-8 border border-stone-800 rounded-sm shadow-2xl backdrop-blur-sm">
            
            <div className="space-y-2 group">
              <label className="block text-xs font-sans tracking-[0.2em] text-stone-500 uppercase group-focus-within:text-amber-700 transition-colors">
                Il Tuo Tormento (Bisogno)
              </label>
              <textarea 
                value={bisogno}
                onChange={(e) => setBisogno(e.target.value)}
                className="w-full bg-transparent border-b border-stone-700 text-xl text-stone-200 p-2 focus:border-amber-700 focus:outline-none transition-colors h-24 resize-none placeholder-stone-800"
                placeholder="Es. Non trovo pace nel lavoro..."
              />
            </div>

            <div className="space-y-2 group">
              <label className="block text-xs font-sans tracking-[0.2em] text-stone-500 uppercase group-focus-within:text-amber-700 transition-colors">
                La Tua Guida (Facoltativo)
              </label>
              <input 
                type="text" 
                value={santo}
                onChange={(e) => setSanto(e.target.value)}
                className="w-full bg-transparent border-b border-stone-700 text-lg text-stone-200 p-2 focus:border-amber-700 focus:outline-none transition-colors placeholder-stone-800"
                placeholder="Es. San Giuda, Santa Rita..."
              />
            </div>

            <div className="pt-4 flex justify-center">
              <button 
                onClick={handleGenerate}
                disabled={loading || !bisogno}
                className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full bg-stone-800/50 group-hover:bg-amber-900/40 transition-all duration-500 ease-out transform translate-y-0"></span>
                <span className="relative text-stone-300 font-sans uppercase tracking-[0.2em] text-xs font-bold group-hover:text-amber-100 transition-colors">
                  Genera Orazione
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-700 to-transparent opacity-50"></div>
              </button>
            </div>

          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center space-y-4 animate-pulse">
            <div className="text-6xl text-amber-900">†</div>
            <p className="text-xs font-sans uppercase tracking-[0.3em] text-stone-600">
              Intercessione in corso...
            </p>
          </div>
        )}

        {/* Result Area */}
        {content && (
          <div ref={resultRef} className="w-full animate-slide-up">
             {/* Back Button */}
             <button 
                onClick={() => setContent('')}
                className="mb-8 text-stone-600 hover:text-amber-600 text-xs font-sans tracking-widest uppercase flex items-center gap-2 transition-colors"
              >
                ← Nuova Richiesta
              </button>

            <div className="prose prose-invert prose-stone max-w-none 
              prose-headings:font-serif prose-headings:font-normal 
              prose-h1:text-4xl prose-h1:text-center prose-h1:text-amber-500/90 prose-h1:mb-8
              prose-h2:text-xl prose-h2:text-stone-400 prose-h2:uppercase prose-h2:tracking-widest prose-h2:border-b prose-h2:border-stone-800 prose-h2:pb-4 prose-h2:mt-12
              prose-h3:text-lg prose-h3:text-amber-700 prose-h3:italic
              prose-p:text-lg prose-p:leading-8 prose-p:text-stone-300
              prose-blockquote:border-l-2 prose-blockquote:border-amber-900 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-stone-400
              prose-li:text-stone-400 prose-li:marker:text-amber-900
              mx-auto bg-stone-900/20 p-8 md:p-12 rounded-lg border border-stone-900 shadow-2xl"
            >
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            
            <div className="mt-16 text-center border-t border-stone-900 pt-8">
               <p className="text-stone-600 text-xs font-sans tracking-[0.2em] uppercase">Studio Pura Luce © {new Date().getFullYear()}</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
