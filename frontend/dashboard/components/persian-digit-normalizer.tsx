"use client";

import { useEffect } from "react";

const latinDigits = /[0-9]/g;
const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

function localizeText(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, code, textarea, [data-keep-latin]")) return;
    const current = node.nodeValue ?? "";
    const localized = current.replace(latinDigits, (digit) => persianDigits[Number(digit)]);
    if (localized !== current) node.nodeValue = localized;
    return;
  }

  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    localizeText(current);
    current = walker.nextNode();
  }
}

export function PersianDigitNormalizer() {
  useEffect(() => {
    const root = document.querySelector(".command");
    if (!root) return;
    localizeText(root);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") localizeText(mutation.target);
        mutation.addedNodes.forEach(localizeText);
      });
    });
    observer.observe(root, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
