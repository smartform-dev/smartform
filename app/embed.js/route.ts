import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const formId = searchParams.get("id")

  if (!formId) {
    return new NextResponse("Missing form ID", { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const script = `
(function() {
  var formId = "${formId}";
  var baseUrl = "${baseUrl}";
  
  // Create iframe
  var iframe = document.createElement('iframe');
  iframe.src = baseUrl + '/forms/' + formId;
  iframe.style.width = '100%';
  iframe.style.border = 'none';
  iframe.style.minHeight = '400px';
  iframe.style.borderRadius = '8px';
  iframe.style.backgroundColor = '#ffffff';
  
  // Handle iframe resizing
  iframe.onload = function() {
    window.addEventListener('message', function(e) {
      if (e.origin !== baseUrl) return;
      if (e.data.type === 'resize' && e.data.formId === formId) {
        iframe.style.height = e.data.height + 'px';
      }
    });
  };
  
  // Find the container and append iframe
  var container = document.getElementById('ai-form-' + formId);
  if (container) {
    container.appendChild(iframe);
  } else {
    console.error('Container element not found: ai-form-' + formId);
  }
})();
  `.trim()

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
