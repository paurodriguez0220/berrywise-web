import React from 'react';

export function GateScreen(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-8 text-center bg-white">
      <div className="text-6xl mb-4">🍓</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">BerryWise</h1>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">
        Add BerryWise to your home screen for the full experience — no browser chrome, just the app.
      </p>

      <div className="w-full max-w-xs bg-gray-50 rounded-2xl p-4 text-left border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">How to install on iPhone</p>
        <ol className="flex flex-col gap-2">
          {[
            'Open this page in Safari',
            'Tap the Share button (box with arrow)',
            'Scroll down and tap "Add to Home Screen"',
            'Tap Add — done!',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
