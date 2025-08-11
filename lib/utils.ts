import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateEmbedCode(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function generateEmbedScript(embedCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  return `<div id="ai-form-${embedCode}"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${baseUrl}/embed/${embedCode}';
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '400px';
    iframe.style.borderRadius = '8px';
    iframe.onload = function() {
      window.addEventListener('message', function(e) {
        if (e.origin !== '${baseUrl}') return;
        if (e.data.type === 'resize' && e.data.embedCode === '${embedCode}') {
          iframe.style.height = e.data.height + 'px';
        }
      });
    };
    document.getElementById('ai-form-${embedCode}').appendChild(iframe);
  })();
</script>`
}

export function generateFormUrl(formId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  return `${baseUrl}/forms/${formId}`
}

export function generateEmbedSnippet(formId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  return `<div id="ai-form-${formId}"></div>
<script src="${baseUrl}/embed.js?id=${formId}"></script>`
}
