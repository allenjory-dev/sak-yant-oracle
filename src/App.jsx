import { useState, useEffect } from "react";

const ELEMENTS = {
  earth: { name: "Earth", thai: "ดิน", symbol: "◆", color: "#8B7355", desc: "Foundation · Roots · What you protect" },
  water: { name: "Water", thai: "น้ำ", symbol: "◎", color: "#5B7B8A", desc: "Depth · Intuition · What flows through you" },
  fire:  { name: "Fire",  thai: "ไฟ", symbol: "△", color: "#A0522D", desc: "Drive · Courage · What burns in you" },
  air:   { name: "Air",   thai: "ลม", symbol: "○", color: "#8A8A6E", desc: "Vision · Freedom · What you reach toward" },
};

const OFFERINGS = [
  { id: "protection", label: "Protection", thai: "ป้องกัน", icon: "◇", traits: ["protection", "foundation", "resilience", "warrior"] },
  { id: "luck", label: "Good Fortune", thai: "โชคดี", icon: "✦", traits: ["luck", "abundance", "manifestation", "optimism"] },
  { id: "courage", label: "Courage", thai: "กล้าหาญ", icon: "△", traits: ["courage", "strength", "warrior", "authority"] },
  { id: "love", label: "Love & Charisma", thai: "เมตตา", icon: "❋", traits: ["charisma", "love", "community", "communication"] },
  { id: "wisdom", label: "Wisdom", thai: "ปัญญา", icon: "◎", traits: ["wisdom", "spirituality", "tradition", "depth"] },
  { id: "travel", label: "Safe Journeys", thai: "เดินทาง", icon: "✧", traits: ["travel", "freedom", "adaptability", "wandering"] },
  { id: "discipline", label: "Discipline", thai: "วินัย", icon: "▪", traits: ["discipline", "balance", "foundation", "resilience"] },
  { id: "rebirth", label: "Transformation", thai: "เกิดใหม่", icon: "◯", traits: ["transformation", "rebirth", "intuition", "depth"] },
  { id: "success", label: "Success", thai: "สำเร็จ", icon: "◈", traits: ["ambition", "leadership", "manifestation", "abundance"] },
];

const BODY_AREAS = [
  { id: "upper_back", label: "Upper Back", y: 18, x: 50, side: "back" },
  { id: "center_back", label: "Center Back", y: 38, x: 50, side: "back" },
  { id: "neck_spine", label: "Neck / Spine", y: 8, x: 50, side: "back" },
  { id: "shoulder", label: "Shoulder", y: 16, x: 28, side: "back" },
  { id: "chest", label: "Chest", y: 22, x: 50, side: "front" },
  { id: "upper_arm", label: "Upper Arm", y: 30, x: 18, side: "front" },
  { id: "forearm", label: "Forearm", y: 48, x: 14, side: "front" },
  { id: "thigh", label: "Thigh", y: 58, x: 35, side: "front" },
  { id: "calf", label: "Calf", y: 76, x: 36, side: "front" },
];

// Storage utilities for persistence
const STORAGE_KEY = "sakyant_oracle";
function saveState(data) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
}
function loadState() {
  try { const d = window.localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch(e) { return null; }
}

const YANTS = {
  hah_taew: {
    name: "Hah Taew", thai: "ห้าแถว", meaning: "Five Sacred Lines",
    category: "geometric", element: "earth",
    description: "Five rows of ancient Khom script, each a distinct blessing. Row 1: protection from unjust punishment. Row 2: reverses bad luck. Row 3: shields from black magic and curses. Row 4: energizes good luck and future ambitions. Row 5: charisma and attraction.",
    traits: ["protection", "tradition", "balance", "foundation", "community", "luck"],
    energy: "grounded", placement: "Upper back or shoulder blade", visibility: "semi", areas: ["upper_back", "shoulder"], size: "medium",
    collageNote: "Foundation piece — traditionally placed first, upper back.",
    famous: "Worn by Angelina Jolie. Given by Ajarn Noo Kanpai at Wat Bang Phra.",
    svg: `<svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><path id="scriptChar" d="M0 0 Q1 2 3 1 Q4 0 3 -1 L1 -1 Q0 -0.5 0 0" stroke="currentColor" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></defs><path d="M100 15 L85 25 L100 35 L115 25 Z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M80 25 L120 25" stroke="currentColor" stroke-width="1" opacity="0.4"/><line x1="15" y1="55" x2="185" y2="55" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="55" r="1.5" fill="currentColor"/><path d="M50 52 L50 58 M55 53 L55 57 M60 51 L60 59 M65 53 L65 57 M70 52 L70 58 M75 54 L75 56 M80 52 L80 58 M85 53 L85 57 M90 51 L90 59 M95 52 L95 58 M100 53 L100 57 M105 51 L105 59 M110 54 L110 56 M115 52 L115 58 M120 53 L120 57 M125 52 L125 58 M130 51 L130 59 M135 53 L135 57 M140 52 L140 58 M145 54 L145 56 M150 51 L150 59 M155 53 L155 57 M160 52 L160 58 M165 54 L165 56 M170 53 L170 57" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="55" r="1.5" fill="currentColor"/><line x1="15" y1="95" x2="185" y2="95" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="95" r="1.5" fill="currentColor"/><path d="M50 92 L50 98 M55 93 L55 97 M60 91 L60 99 M65 93 L65 97 M70 92 L70 98 M75 94 L75 96 M80 92 L80 98 M85 93 L85 97 M90 91 L90 99 M95 92 L95 98 M100 93 L100 97 M105 91 L105 99 M110 94 L110 96 M115 92 L115 98 M120 93 L120 97 M125 92 L125 98 M130 91 L130 99 M135 93 L135 97 M140 92 L140 98 M145 94 L145 96 M150 91 L150 99 M155 93 L155 97 M160 92 L160 98 M165 94 L165 96 M170 93 L170 97" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="95" r="1.5" fill="currentColor"/><line x1="15" y1="135" x2="185" y2="135" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="135" r="1.5" fill="currentColor"/><path d="M50 132 L50 138 M55 133 L55 137 M60 131 L60 139 M65 133 L65 137 M70 132 L70 138 M75 134 L75 136 M80 132 L80 138 M85 133 L85 137 M90 131 L90 139 M95 132 L95 138 M100 133 L100 137 M105 131 L105 139 M110 134 L110 136 M115 132 L115 138 M120 133 L120 137 M125 132 L125 138 M130 131 L130 139 M135 133 L135 137 M140 132 L140 138 M145 134 L145 136 M150 131 L150 139 M155 133 L155 137 M160 132 L160 138 M165 134 L165 136 M170 133 L170 137" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="135" r="1.5" fill="currentColor"/><line x1="15" y1="175" x2="185" y2="175" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="175" r="1.5" fill="currentColor"/><path d="M50 172 L50 178 M55 173 L55 177 M60 171 L60 179 M65 173 L65 177 M70 172 L70 178 M75 174 L75 176 M80 172 L80 178 M85 173 L85 177 M90 171 L90 179 M95 172 L95 178 M100 173 L100 177 M105 171 L105 179 M110 174 L110 176 M115 172 L115 178 M120 173 L120 177 M125 172 L125 178 M130 171 L130 179 M135 173 L135 177 M140 172 L140 178 M145 174 L145 176 M150 171 L150 179 M155 173 L155 177 M160 172 L160 178 M165 174 L165 176 M170 173 L170 177" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="175" r="1.5" fill="currentColor"/><line x1="15" y1="215" x2="185" y2="215" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="215" r="1.5" fill="currentColor"/><path d="M50 212 L50 218 M55 213 L55 217 M60 211 L60 219 M65 213 L65 217 M70 212 L70 218 M75 214 L75 216 M80 212 L80 218 M85 213 L85 217 M90 211 L90 219 M95 212 L95 218 M100 213 L100 217 M105 211 L105 219 M110 214 L110 216 M115 212 L115 218 M120 213 L120 217 M125 212 L125 218 M130 211 L130 219 M135 213 L135 217 M140 212 L140 218 M145 214 L145 216 M150 211 L150 219 M155 213 L155 217 M160 212 L160 218 M165 214 L165 216 M170 213 L170 217" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="215" r="1.5" fill="currentColor"/><rect x="12" y="12" width="176" height="223" stroke="currentColor" stroke-width="1" opacity="0.5" fill="none"/></svg>`
  },
  gao_yord: {
    name: "Gao Yord", thai: "เก้ายอด", meaning: "Nine Peaks",
    category: "geometric", element: "air",
    description: "The king of all yants. Nine spires represent the nine peaks of sacred Mount Meru and the nine Buddhas, each bestowing special powers. Contains the essence of all other yants. The ultimate mark of spiritual completeness and total protection.",
    traits: ["leadership", "ambition", "spirituality", "completeness", "wisdom", "protection"],
    energy: "elevated", placement: "Back of neck / top of spine", visibility: "hidden", areas: ["neck_spine", "upper_back"], size: "small",
    collageNote: "Crown piece — sits at the very top of the back, above all others. Often the last yant added.",
    famous: "The most sacred yant — holds power over all other designs.",
    svg: `<svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 10 L110 40 L100 35 L90 40 Z" stroke="currentColor" stroke-width="1.8"/><path d="M100 10 L100 35" stroke="currentColor" stroke-width="0.8"/><path d="M50 70 L60 100 L50 95 L40 100 Z" stroke="currentColor" stroke-width="1.6"/><path d="M50 70 L50 95" stroke="currentColor" stroke-width="0.7"/><path d="M100 60 L110 90 L100 85 L90 90 Z" stroke="currentColor" stroke-width="1.6"/><path d="M100 60 L100 85" stroke="currentColor" stroke-width="0.7"/><path d="M150 70 L160 100 L150 95 L140 100 Z" stroke="currentColor" stroke-width="1.6"/><path d="M150 70 L150 95" stroke="currentColor" stroke-width="0.7"/><path d="M20 120 L30 150 L20 145 L10 150 Z" stroke="currentColor" stroke-width="1.4"/><path d="M20 120 L20 145" stroke="currentColor" stroke-width="0.6"/><path d="M70 115 L80 145 L70 140 L60 145 Z" stroke="currentColor" stroke-width="1.4"/><path d="M70 115 L70 140" stroke="currentColor" stroke-width="0.6"/><path d="M100 110 L110 140 L100 135 L90 140 Z" stroke="currentColor" stroke-width="1.4"/><path d="M100 110 L100 135" stroke="currentColor" stroke-width="0.6"/><path d="M130 115 L140 145 L130 140 L120 145 Z" stroke="currentColor" stroke-width="1.4"/><path d="M130 115 L130 140" stroke="currentColor" stroke-width="0.6"/><path d="M180 120 L190 150 L180 145 L170 150 Z" stroke="currentColor" stroke-width="1.4"/><path d="M180 120 L180 145" stroke="currentColor" stroke-width="0.6"/><line x1="30" y1="160" x2="170" y2="160" stroke="currentColor" stroke-width="2"/><path d="M25 165 Q100 175 175 165" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="35" y1="175" x2="165" y2="175" stroke="currentColor" stroke-width="1"/><line x1="45" y1="185" x2="155" y2="185" stroke="currentColor" stroke-width="0.8" opacity="0.7"/><line x1="50" y1="195" x2="150" y2="195" stroke="currentColor" stroke-width="0.8" opacity="0.7"/><line x1="55" y1="205" x2="145" y2="205" stroke="currentColor" stroke-width="0.8" opacity="0.6"/><path d="M65 160 L65 205 M85 160 L85 205 M100 160 L100 205 M115 160 L115 205 M135 160 L135 205" stroke="currentColor" stroke-width="0.5" opacity="0.4"/></svg>`
  },
  paed_tidt: {
    name: "Paed Tidt", thai: "แปดทิศ", meaning: "Eight Directions",
    category: "geometric", element: "air",
    description: "Eight rows of sacred prayers pointing in all cardinal and diagonal directions. Protects the wearer wherever they travel, ensuring safety across all paths of life. A guardian for those always in motion.",
    traits: ["travel", "freedom", "adaptability", "curiosity", "wandering", "protection"],
    energy: "expansive", placement: "Upper back or chest", visibility: "semi", areas: ["upper_back", "chest"], size: "medium",
    collageNote: "Central back piece — pairs beautifully with Gao Yord above it.",
    famous: "Popular with travelers, flight crew, and nomadic souls.",
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="85" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="100" r="70" stroke="currentColor" stroke-width="1.5"/><circle cx="100" cy="100" r="50" stroke="currentColor" stroke-width="1.2"/><circle cx="100" cy="100" r="25" stroke="currentColor" stroke-width="1"/><circle cx="100" cy="100" r="12" fill="currentColor" opacity="0.3"/><line x1="100" y1="15" x2="100" y2="45" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="10" r="3" fill="currentColor"/><line x1="100" y1="155" x2="100" y2="185" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="190" r="3" fill="currentColor"/><line x1="15" y1="100" x2="45" y2="100" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="100" r="3" fill="currentColor"/><line x1="155" y1="100" x2="185" y2="100" stroke="currentColor" stroke-width="2"/><circle cx="190" cy="100" r="3" fill="currentColor"/><line x1="35" y1="35" x2="55" y2="55" stroke="currentColor" stroke-width="1.8"/><circle cx="25" cy="25" r="3" fill="currentColor"/><line x1="145" y1="145" x2="165" y2="165" stroke="currentColor" stroke-width="1.8"/><circle cx="175" cy="175" r="3" fill="currentColor"/><line x1="165" y1="35" x2="145" y2="55" stroke="currentColor" stroke-width="1.8"/><circle cx="175" cy="25" r="3" fill="currentColor"/><line x1="55" y1="145" x2="35" y2="165" stroke="currentColor" stroke-width="1.8"/><circle cx="25" cy="175" r="3" fill="currentColor"/><path d="M100 50 L100 70 M95 60 L105 60 M92 55 L108 55" stroke="currentColor" stroke-width="0.8"/><path d="M100 130 L100 150 M95 140 L105 140 M92 145 L108 145" stroke="currentColor" stroke-width="0.8"/><path d="M50 100 L70 100 M60 95 L60 105 M55 92 L55 108" stroke="currentColor" stroke-width="0.8"/><path d="M130 100 L150 100 M140 95 L140 105 M145 92 L145 108" stroke="currentColor" stroke-width="0.8"/><path d="M55 55 L65 65 M60 50 L70 60 M50 60 L60 50" stroke="currentColor" stroke-width="0.8"/><path d="M145 145 L155 155 M140 150 L150 160 M150 140 L160 150" stroke="currentColor" stroke-width="0.8"/><path d="M145 55 L135 65 M140 50 L130 60 M150 60 L140 50" stroke="currentColor" stroke-width="0.8"/><path d="M55 145 L65 135 M60 150 L70 140 M50 140 L60 150" stroke="currentColor" stroke-width="0.8"/></svg>`
  },
  suea_koo: {
    name: "Suea Koo", thai: "เสือคู่", meaning: "Twin Tigers",
    category: "animal", element: "fire",
    description: "Two tigers facing each other — power and fearlessness in balance. The most popular Muay Thai tattoo. Courage and dominance without recklessness. Power that knows when to move and when to wait.",
    traits: ["strength", "courage", "authority", "discipline", "warrior", "balance"],
    energy: "fierce", placement: "Chest or upper back", visibility: "semi", areas: ["chest", "upper_back"], size: "large",
    collageNote: "Chest centerpiece — traditionally placed over the heart.",
    famous: "The definitive Muay Thai fighter's tattoo.",
    svg: `<svg viewBox="0 0 250 200" fill="none" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="60" cy="100" rx="45" ry="55" stroke="currentColor" stroke-width="2"/><circle cx="45" cy="50" r="22" stroke="currentColor" stroke-width="1.8"/><circle cx="38" cy="42" r="6" stroke="currentColor" stroke-width="1.2"/><circle cx="52" cy="42" r="6" stroke="currentColor" stroke-width="1.2"/><circle cx="36" cy="40" r="2.5" fill="currentColor"/><circle cx="54" cy="40" r="2.5" fill="currentColor"/><ellipse cx="30" cy="52" r="4" ry="6" stroke="currentColor" stroke-width="1"/><ellipse cx="60" cy="52" r="4" ry="6" stroke="currentColor" stroke-width="1"/><path d="M42 60 L38 68 L45 65 L48 72" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M48 60 L52 68 L45 65" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M25 90 Q15 100 18 125" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M95 90 Q105 100 102 125" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M30 140 L35 165" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M90 140 L85 165" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="25" y1="105" x2="95" y2="105" stroke="currentColor" stroke-width="1.2"/><path d="M40 110 L40 130 M50 108 L50 132 M60 110 L60 130 M70 108 L70 132 M80 110 L80 130" stroke="currentColor" stroke-width="0.8"/></g><g><ellipse cx="190" cy="100" rx="45" ry="55" stroke="currentColor" stroke-width="2"/><circle cx="205" cy="50" r="22" stroke="currentColor" stroke-width="1.8"/><circle cx="212" cy="42" r="6" stroke="currentColor" stroke-width="1.2"/><circle cx="198" cy="42" r="6" stroke="currentColor" stroke-width="1.2"/><circle cx="214" cy="40" r="2.5" fill="currentColor"/><circle cx="196" cy="40" r="2.5" fill="currentColor"/><ellipse cx="220" cy="52" r="4" ry="6" stroke="currentColor" stroke-width="1"/><ellipse cx="190" cy="52" r="4" ry="6" stroke="currentColor" stroke-width="1"/><path d="M208 60 L212 68 L205 65 L202 72" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M202 60 L198 68 L205 65" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M225 90 Q235 100 232 125" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M155 90 Q145 100 148 125" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M220 140 L215 165" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M160 140 L165 165" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="155" y1="105" x2="225" y2="105" stroke="currentColor" stroke-width="1.2"/><path d="M170 110 L170 130 M180 108 L180 132 M190 110 L190 130 M200 108 L200 132 M210 110 L210 130" stroke="currentColor" stroke-width="0.8"/></g><path d="M120 40 L130 55 L120 60 L110 55 Z" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="115" y1="50" x2="125" y2="50" stroke="currentColor" stroke-width="0.8"/><path d="M120 80 Q110 100 120 140" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="4,3"/><path d="M130 80 Q140 100 130 140" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="4,3"/></svg>`
  },
  suea_diew: {
    name: "Suea Diew", thai: "เสือเดียว", meaning: "Single Tiger",
    category: "animal", element: "fire",
    description: "The lone tiger — solitary warrior. Personal courage, independence, and the strength to face challenges alone. Less about authority over others; more about the inner fire that refuses to be extinguished.",
    traits: ["strength", "independence", "courage", "warrior", "resilience"],
    energy: "fierce", placement: "Upper arm, thigh, or chest", visibility: "visible", areas: ["upper_arm", "thigh", "chest"], size: "medium",
    collageNote: "Standalone or paired with Hah Taew. Strong arm or thigh piece.",
    famous: "Chosen by those who walk their own path.",
    svg: `<svg viewBox="0 0 180 230" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="90" cy="130" rx="55" ry="70" stroke="currentColor" stroke-width="2.2"/><circle cx="90" cy="55" r="35" stroke="currentColor" stroke-width="2"/><circle cx="70" cy="38" r="10" stroke="currentColor" stroke-width="1.5"/><circle cx="110" cy="38" r="10" stroke="currentColor" stroke-width="1.5"/><circle cx="66" cy="34" r="3" fill="currentColor"/><circle cx="114" cy="34" r="3" fill="currentColor"/><ellipse cx="55" cy="50" r="7" ry="12" stroke="currentColor" stroke-width="1.3" transform="rotate(-25 55 50)"/><ellipse cx="125" cy="50" r="7" ry="12" stroke="currentColor" stroke-width="1.3" transform="rotate(25 125 50)"/><path d="M75 75 L65 90 L82 85 L78 100" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M105 75 L115 90 L98 85 L102 100" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M55 115 Q40 135 50 165" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M125 115 Q140 135 130 165" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M70 180 L65 215" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M110 180 L115 215" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M60 75 Q60 85 50 95" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M120 75 Q120 85 130 95" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M90 140 Q85 160 90 190" stroke="currentColor" stroke-width="1" fill="none"/><line x1="55" y1="125" x2="125" y2="125" stroke="currentColor" stroke-width="1.3"/><path d="M70 135 L70 155 M90 133 L90 157 M110 135 L110 155" stroke="currentColor" stroke-width="0.9"/></svg>`
  },
  hanuman: {
    name: "Hanuman", thai: "หนุมาน", meaning: "The Monkey God",
    category: "deity", element: "fire",
    description: "Divine monkey warrior of the Ramayana — absolute devotion, supernatural strength, indestructibility. Hanuman moved mountains and crossed oceans for love. The ultimate symbol of loyalty: what you would do for those you serve.",
    traits: ["loyalty", "devotion", "resilience", "service", "love", "strength"],
    energy: "devoted", placement: "Back, chest, or upper arm", visibility: "semi", areas: ["upper_back", "chest", "upper_arm"], size: "large",
    collageNote: "Pairs with Suea Koo — devotion and strength as one.",
    famous: "Also protects against black magic directed at the wearer.",
    svg: `<svg viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M80 15 L75 10 L80 5 L85 10 Z" stroke="currentColor" stroke-width="1.2" fill="currentColor" opacity="0.2"/><path d="M60 20 Q70 12 80 15 Q90 12 100 20" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="80" cy="35" r="28" stroke="currentColor" stroke-width="2"/><circle cx="65" cy="28" r="8" stroke="currentColor" stroke-width="1.3"/><circle cx="95" cy="28" r="8" stroke="currentColor" stroke-width="1.3"/><circle cx="62" cy="25" r="3" fill="currentColor"/><circle cx="98" cy="25" r="3" fill="currentColor"/><path d="M70 50 Q75 60 80 55 Q85 60 90 50" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M40 65 L25 50 L28 75" stroke="currentColor" stroke-width="2" fill="none"/><path d="M40 70 L30 75 L35 85" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M40 85 L25 95 L35 100" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M120 65 L135 50 L132 75" stroke="currentColor" stroke-width="2" fill="none"/><path d="M120 70 L130 75 L125 85" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M120 85 L135 95 L125 100" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="80" cy="120" rx="38" ry="50" stroke="currentColor" stroke-width="2"/><path d="M55 100 Q35 110 40 145" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M105 100 Q125 110 120 145" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M60 170 L50 210" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M100 170 L110 210" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M75 135 Q80 155 85 135" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M80 160 Q70 175 80 190" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="80" cy="120" r="12" fill="currentColor" opacity="0.15"/></svg>`
  },
  naga: {
    name: "Naga", thai: "นาค", meaning: "Serpent God",
    category: "animal", element: "water",
    description: "The great cosmic serpent of Southeast Asian mythology — water deity, temple guardian, bridge between worlds. Represents transformation, ancient wisdom, the underworld, and the power to shed old skin and emerge reborn.",
    traits: ["transformation", "intuition", "mystery", "depth", "rebirth", "wisdom"],
    energy: "transformative", placement: "Spine, arm, or calf", visibility: "visible", areas: ["upper_arm", "calf", "center_back"], size: "large",
    collageNote: "Flows along the spine or limbs — a natural bridge in any collage.",
    famous: "Naga imagery guards every major Thai temple gate.",
    svg: `<svg viewBox="0 0 140 250" fill="none" xmlns="http://www.w3.org/2000/svg"><g><circle cx="70" cy="25" r="20" stroke="currentColor" stroke-width="2"/><path d="M50 18 Q40 8 35 15" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M90 18 Q100 8 105 15" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="60" cy="22" r="3" fill="currentColor"/><circle cx="80" cy="22" r="3" fill="currentColor"/><path d="M58 32 Q70 38 82 32" stroke="currentColor" stroke-width="1.3" fill="none"/></g><path d="M70 50 Q100 70 95 100 Q90 120 70 135 Q50 120 55 100 Q60 70 70 50" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M70 135 Q95 155 90 185 Q85 205 70 220 Q55 205 60 185 Q65 155 70 135" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M70 50 Q45 70 50 100 Q55 120 70 135" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M70 135 Q50 155 55 185 Q60 205 70 220" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M58 60 L52 55 M58 70 L50 68 M56 80 L48 80 M60 90 L54 95 M68 100 L68 108" stroke="currentColor" stroke-width="0.8"/><path d="M82 60 L88 55 M82 70 L90 68 M84 80 L92 80 M80 90 L86 95 M72 100 L72 108" stroke="currentColor" stroke-width="0.8"/><path d="M58 145 L52 140 M58 155 L50 153 M56 165 L48 165 M60 175 L54 180 M68 190 L68 198" stroke="currentColor" stroke-width="0.8"/><path d="M82 145 L88 140 M82 155 L90 153 M84 165 L92 165 M80 175 L86 180 M72 190 L72 198" stroke="currentColor" stroke-width="0.8"/><path d="M70 220 L70 245" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`
  },
  rahu: {
    name: "Rahu", thai: "ราหู", meaning: "The Moon Devourer",
    category: "deity", element: "water",
    description: "A demon god who drank the elixir of immortality before being beheaded — only his immortal head remains, eternally devouring the sun and moon. Worn for protection against misfortune, transformation through darkness, and hidden intelligence. Rahu devours bad luck before it reaches you.",
    traits: ["transformation", "protection", "mystery", "resilience", "intuition", "rebirth"],
    energy: "transformative", placement: "Back or chest", visibility: "semi", areas: ["upper_back", "chest"], size: "large",
    collageNote: "Often placed alone — its intensity commands its own space.",
    famous: "One of the most powerful protective yants. Worn by those facing serious adversity.",
    svg: `<svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M80 20 L70 8 L80 12 L90 8 Z" stroke="currentColor" stroke-width="1.3" fill="currentColor" opacity="0.2"/><path d="M60 35 Q80 22 100 35" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="100" cy="65" r="50" stroke="currentColor" stroke-width="2.5"/><circle cx="100" cy="65" r="35" stroke="currentColor" stroke-width="1.8"/><path d="M60 110 Q80 145 100 160 Q120 145 140 110" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linejoin="round"/><path d="M65 105 L55 115 L70 130" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><path d="M135 105 L145 115 L130 130" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><circle cx="80" cy="55" r="7" fill="currentColor" opacity="0.5"/><circle cx="120" cy="55" r="7" fill="currentColor" opacity="0.5"/><path d="M75 78 Q85 92 95 88" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M105 88 Q115 92 125 78" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M70 100 L60 105 M70 105 L58 110 M70 110 L60 115" stroke="currentColor" stroke-width="1"/><path d="M130 100 L140 105 M130 105 L142 110 M130 110 L140 115" stroke="currentColor" stroke-width="1"/><path d="M85 118 Q100 125 115 118" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M90 135 L85 165 M110 135 L115 165" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="50" cy="50" r="20" stroke="currentColor" stroke-width="1" opacity="0.6"/><path d="M50 32 L50 68 M32 50 L68 50" stroke="currentColor" stroke-width="0.8" opacity="0.4"/><circle cx="150" cy="50" r="20" stroke="currentColor" stroke-width="1" opacity="0.6"/><path d="M150 32 L150 68 M132 50 L168 50" stroke="currentColor" stroke-width="0.8" opacity="0.4"/></svg>`
  },
  mongkol: {
    name: "Mongkol", thai: "มงคล", meaning: "Sacred Crown",
    category: "geometric", element: "air",
    description: "An auspicious crown-like design drawing prosperity, good luck, and positive energy toward you. Less about protection and more about attraction — wealth, opportunity, and success flowing in your direction.",
    traits: ["abundance", "optimism", "creativity", "manifestation", "joy", "luck"],
    energy: "magnetic", placement: "Chest or forearm", visibility: "visible", areas: ["chest", "forearm"], size: "medium",
    collageNote: "Welcoming piece — pairs well with Sivali or Sarika Koo.",
    famous: "Given to merchants, artists, and entrepreneurs.",
    svg: `<svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 200 L50 80 Q50 30 85 20 L100 10 L115 20 Q150 30 150 80 L150 200 Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M55 80 Q55 40 85 32 L100 24 L115 32 Q145 40 145 80" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="50" y1="120" x2="150" y2="120" stroke="currentColor" stroke-width="1.5"/><line x1="55" y1="160" x2="145" y2="160" stroke="currentColor" stroke-width="1.2"/><path d="M60 35 L60 12 L65 25 L70 12 Z" stroke="currentColor" stroke-width="1.4" fill="currentColor" opacity="0.25"/><path d="M100 15 L100 5 L106 18 L112 5 Z" stroke="currentColor" stroke-width="1.5" fill="currentColor" opacity="0.3"/><path d="M140 35 L140 12 L135 25 L130 12 Z" stroke="currentColor" stroke-width="1.4" fill="currentColor" opacity="0.25"/><circle cx="60" cy="50" r="8" stroke="currentColor" stroke-width="1.3"/><circle cx="100" cy="42" r="8" stroke="currentColor" stroke-width="1.3"/><circle cx="140" cy="50" r="8" stroke="currentColor" stroke-width="1.3"/><line x1="60" y1="58" x2="60" y2="120" stroke="currentColor" stroke-width="1.1"/><line x1="100" y1="50" x2="100" y2="120" stroke="currentColor" stroke-width="1.1"/><line x1="140" y1="58" x2="140" y2="120" stroke="currentColor" stroke-width="1.1"/><path d="M75 135 L75 155 M100 130 L100 155 M125 135 L125 155" stroke="currentColor" stroke-width="1"/><circle cx="75" cy="160" r="3" fill="currentColor" opacity="0.3"/><circle cx="100" cy="165" r="3" fill="currentColor" opacity="0.3"/><circle cx="125" cy="160" r="3" fill="currentColor" opacity="0.3"/></svg>`
  },
  sarika_koo: {
    name: "Sarika Koo", thai: "สาริกาคู่", meaning: "Twin Love Birds",
    category: "animal", element: "air",
    description: "Two mythical songbirds whose voices charm anyone who hears them. Blesses the wearer with magnetic charisma, eloquence, and the power to move hearts through words and presence.",
    traits: ["charisma", "love", "community", "communication", "abundance", "joy"],
    energy: "magnetic", placement: "Chest or neck", visibility: "visible", areas: ["chest", "neck_spine"], size: "small",
    collageNote: "Pairs beautifully with Hah Taew. Social and romantic energy.",
    famous: "Used by those in sales, performance, leadership, and romance.",
    svg: `<svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="60" cy="90" rx="32" ry="45" stroke="currentColor" stroke-width="1.8"/><circle cx="50" cy="40" r="20" stroke="currentColor" stroke-width="1.6"/><circle cx="40" cy="28" r="10" stroke="currentColor" stroke-width="1.2"/><circle cx="60" cy="28" r="10" stroke="currentColor" stroke-width="1.2"/><circle cx="38" cy="24" r="3" fill="currentColor"/><circle cx="62" cy="24" r="3" fill="currentColor"/><path d="M35 42 Q30 32 25 42" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M65 42 Q70 32 75 42" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M30 55 Q20 65 22 85" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M90 55 Q100 65 98 85" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M40 130 L35 150" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M80 130 L85 150" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M45 55 L40 75" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M75 55 L80 75" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M55 100 L50 120" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="3,2"/><path d="M65 100 L70 120" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="3,2"/></g><g><ellipse cx="160" cy="90" rx="32" ry="45" stroke="currentColor" stroke-width="1.8"/><circle cx="170" cy="40" r="20" stroke="currentColor" stroke-width="1.6"/><circle cx="180" cy="28" r="10" stroke="currentColor" stroke-width="1.2"/><circle cx="160" cy="28" r="10" stroke="currentColor" stroke-width="1.2"/><circle cx="182" cy="24" r="3" fill="currentColor"/><circle cx="158" cy="24" r="3" fill="currentColor"/><path d="M185 42 Q190 32 195 42" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M155 42 Q150 32 145 42" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M190 55 Q200 65 198 85" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M130 55 Q120 65 122 85" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M180 130 L185 150" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M140 130 L135 150" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M175 55 L180 75" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M145 55 L140 75" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M165 100 L170 120" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="3,2"/><path d="M155 100 L150 120" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="3,2"/></g><path d="M95 55 Q110 45 125 55" stroke="currentColor" stroke-width="1.3" fill="none"/><circle cx="110" cy="48" r="4" fill="currentColor" opacity="0.25"/><path d="M95 95 Q110 110 125 95" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M100 80 L120 80" stroke="currentColor" stroke-width="0.8" opacity="0.5"/></svg>`
  },
  yant_kraw_petch: {
    name: "Kraw Petch", thai: "เกราะเพชร", meaning: "Diamond Armour",
    category: "geometric", element: "earth",
    description: "Diamond armour — the strongest, most impenetrable spiritual protection. Shields against weapons, ghosts, spirits, black magic, and sorcery. Enhances personal power and mental fortitude. Traditionally for those who face real physical danger.",
    traits: ["protection", "strength", "warrior", "foundation", "resilience", "courage"],
    energy: "grounded", placement: "Back or chest", visibility: "semi", areas: ["upper_back", "chest"], size: "large",
    collageNote: "Full-back centerpiece. Heavy protective energy — worn with intention.",
    famous: "Worn by soldiers, police, and those in danger professions.",
    svg: `<svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="100,10 185,105 100,210 15,105" stroke="currentColor" stroke-width="2.5" fill="none"/><polygon points="100,35 165,105 100,180 35,105" stroke="currentColor" stroke-width="2" fill="none"/><polygon points="100,60 145,105 100,155 55,105" stroke="currentColor" stroke-width="1.5" fill="none"/><polygon points="100,80 125,105 100,135 75,105" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="100" cy="105" r="12" stroke="currentColor" stroke-width="1.3"/><circle cx="100" cy="105" r="6" fill="currentColor" opacity="0.25"/><line x1="100" y1="10" x2="100" y2="210" stroke="currentColor" stroke-width="0.8" opacity="0.4"/><line x1="15" y1="105" x2="185" y2="105" stroke="currentColor" stroke-width="0.8" opacity="0.4"/><line x1="35" y1="60" x2="165" y2="150" stroke="currentColor" stroke-width="0.6" opacity="0.3"/><line x1="165" y1="60" x2="35" y2="150" stroke="currentColor" stroke-width="0.6" opacity="0.3"/><path d="M100 10 L92 20 L108 20" stroke="currentColor" stroke-width="1.2" fill="currentColor" opacity="0.3"/><path d="M185 105 L175 97 L175 113" stroke="currentColor" stroke-width="1.2" fill="currentColor" opacity="0.3"/><path d="M100 210 L108 200 L92 200" stroke="currentColor" stroke-width="1.2" fill="currentColor" opacity="0.3"/><path d="M15 105 L25 97 L25 113" stroke="currentColor" stroke-width="1.2" fill="currentColor" opacity="0.3"/><circle cx="100" cy="35" r="2" fill="currentColor"/><circle cx="165" cy="105" r="2" fill="currentColor"/><circle cx="100" cy="175" r="2" fill="currentColor"/><circle cx="35" cy="105" r="2" fill="currentColor"/></svg>`
  },
  yant_putsoorn: {
    name: "Putsoorn", thai: "พุทธซ้อน", meaning: "Buddha's Crown",
    category: "deity", element: "air",
    description: "A crown-like formation representing Buddha's enlightenment. One of the most sacred yants — a living talisman of the Buddha himself. Brings protection, increases charisma, and channels the direct blessings of the dharma.",
    traits: ["spirituality", "wisdom", "completeness", "protection", "charisma", "tradition"],
    energy: "elevated", placement: "Upper back or between shoulder blades", visibility: "hidden", areas: ["upper_back", "center_back"], size: "medium",
    collageNote: "Sacred crown — often placed above Hah Taew, below Gao Yord.",
    famous: "Sometimes called the Maha Yant — one of the highest level yants.",
    svg: `<svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="140" rx="65" ry="65" stroke="currentColor" stroke-width="2"/><ellipse cx="100" cy="140" rx="45" ry="45" stroke="currentColor" stroke-width="1.5" opacity="0.7"/><path d="M40 100 Q50 50 100 35 Q150 50 160 100" stroke="currentColor" stroke-width="2" fill="none"/><path d="M60 75 Q70 50 85 40 Q100 35 100 30 Q100 35 115 40 Q130 50 140 75" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="60" y1="65" x2="60" y2="20" stroke="currentColor" stroke-width="1.3"/><line x1="100" y1="55" x2="100" y2="8" stroke="currentColor" stroke-width="1.5"/><line x1="140" y1="65" x2="140" y2="20" stroke="currentColor" stroke-width="1.3"/><circle cx="60" cy="18" r="5" stroke="currentColor" stroke-width="1.2"/><circle cx="100" cy="6" r="6" stroke="currentColor" stroke-width="1.5"/><circle cx="140" cy="18" r="5" stroke="currentColor" stroke-width="1.2"/><path d="M60 20 L55 10 L65 15 Z" stroke="currentColor" stroke-width="1" fill="currentColor" opacity="0.35"/><path d="M100 10 L95 0 L105 0 Z" stroke="currentColor" stroke-width="1.2" fill="currentColor" opacity="0.35"/><path d="M140 20 L135 10 L145 15 Z" stroke="currentColor" stroke-width="1" fill="currentColor" opacity="0.35"/><line x1="50" y1="95" x2="100" y2="140" stroke="currentColor" stroke-width="1" opacity="0.5"/><line x1="150" y1="95" x2="100" y2="140" stroke="currentColor" stroke-width="1" opacity="0.5"/><ellipse cx="100" cy="140" rx="25" ry="25" stroke="currentColor" stroke-width="1" opacity="0.6"/><circle cx="100" cy="140" r="10" fill="currentColor" opacity="0.2"/><path d="M80 160 L80 200" stroke="currentColor" stroke-width="1"/><path d="M100 165 L100 205" stroke="currentColor" stroke-width="1"/><path d="M120 160 L120 200" stroke="currentColor" stroke-width="1"/></svg>`
  },
  phaya_khrue: {
    name: "Phaya Khrue", thai: "พญาครุฑ", meaning: "Garuda / Divine Eagle",
    category: "deity", element: "fire",
    description: "The Garuda — divine eagle of Hindu-Buddhist mythology, mount of Vishnu. Represents royal power, divine authority, and absolute freedom. In Thai tradition, the Garuda is the symbol of the king and nation. Wings spread wide, it cannot be touched.",
    traits: ["freedom", "authority", "leadership", "spirituality", "courage", "ambition"],
    energy: "elevated", placement: "Upper back — wings spanning the shoulders", visibility: "semi", areas: ["upper_back"], size: "large",
    collageNote: "Statement centerpiece — wings span across the upper back.",
    famous: "The royal symbol of Thailand. Deep national and spiritual significance.",
    svg: `<svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="140" cy="35" r="22" stroke="currentColor" stroke-width="2.2"/><path d="M125 25 Q118 12 110 20" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M155 25 Q162 12 170 20" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="130" cy="32" r="3.5" fill="currentColor"/><circle cx="150" cy="32" r="3.5" fill="currentColor"/><path d="M128 45 Q135 55 142 50 Q148 55 155 45" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M140 57 L140 120" stroke="currentColor" stroke-width="2"/><path d="M100 60 L60 40 L75 70 Q70 90 85 115 Q95 100 110 110 Q115 80 120 65" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linejoin="round"/><path d="M180 60 L220 40 L205 70 Q210 90 195 115 Q185 100 170 110 Q165 80 160 65" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linejoin="round"/><path d="M85 45 L45 20 L65 55" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M195 45 L235 20 L215 55" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M70 70 L55 95 L75 85" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M210 70 L225 95 L205 85" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M90 110 L75 145 L95 130" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M190 110 L205 145 L185 130" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M110 125 L100 165 L115 145" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M170 125 L180 165 L165 145" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M140 135 L135 175 L145 155" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M140 135 L145 175 L135 155" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M75 80 L65 70 L70 85" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M205 80 L215 70 L210 85" stroke="currentColor" stroke-width="0.8" fill="none"/></svg>`
  },
  phaya_tao: {
    name: "Phaya Tao Ruen", thai: "พญาเต่ารือ", meaning: "Sacred Turtle",
    category: "animal", element: "earth",
    description: "Buddha was once reincarnated as a royal turtle who sacrificed his own flesh for the poor. The turtle yant carries that karma of selfless giving — long life, prosperity, good fortune, and ensures your trade and work will always thrive.",
    traits: ["abundance", "loyalty", "foundation", "wisdom", "tradition", "luck"],
    energy: "grounded", placement: "Back or chest", visibility: "semi", areas: ["upper_back", "chest"], size: "medium",
    collageNote: "Grounding piece — balances more intense yants in a collage.",
    famous: "Especially auspicious for business owners and traders.",
    svg: `<svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="85" rx="70" ry="60" stroke="currentColor" stroke-width="2"/><path d="M70 75 L75 55 L80 70 L85 55 L90 75 M110 75 L115 55 L120 70 L125 55 L130 75" stroke="currentColor" stroke-width="1.3" fill="none"/><ellipse cx="100" cy="70" rx="28" ry="32" stroke="currentColor" stroke-width="1.8"/><circle cx="100" cy="65" r="12" stroke="currentColor" stroke-width="1.3"/><path d="M100 60 Q95 55 90 58" stroke="currentColor" stroke-width="1" fill="none"/><path d="M100 60 Q105 55 110 58" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="90" cy="62" r="2.5" fill="currentColor"/><circle cx="110" cy="62" r="2.5" fill="currentColor"/><path d="M100 70 Q98 78 100 82" stroke="currentColor" stroke-width="1.2" fill="none"/><ellipse cx="45" cy="85" rx="12" ry="8" stroke="currentColor" stroke-width="1.4"/><circle cx="45" cy="85" r="3.5" fill="currentColor"/><ellipse cx="155" cy="85" rx="12" ry="8" stroke="currentColor" stroke-width="1.4"/><circle cx="155" cy="85" r="3.5" fill="currentColor"/><ellipse cx="55" cy="135" rx="10" ry="6" stroke="currentColor" stroke-width="1.2"/><circle cx="55" cy="135" r="2.5" fill="currentColor"/><ellipse cx="145" cy="135" rx="10" ry="6" stroke="currentColor" stroke-width="1.2"/><circle cx="145" cy="135" r="2.5" fill="currentColor"/><ellipse cx="100" cy="145" rx="8" ry="5" stroke="currentColor" stroke-width="1.2"/><circle cx="100" cy="145" r="2" fill="currentColor"/><path d="M60 85 Q65 80 70 85" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M140 85 Q135 80 130 85" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M75 130 L80 150 L85 145" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M125 130 L120 150 L115 145" stroke="currentColor" stroke-width="0.8" fill="none"/></svg>`
  },
  payamee: {
    name: "Payamee", thai: "พยาหมี", meaning: "Sacred Bear",
    category: "animal", element: "earth",
    description: "The bear yant channels unyielding strength, physical and mental fortitude, invincibility against adversity, and unwavering determination. The bear does not rush — patient, powerful, and impossible to stop once it has decided to move.",
    traits: ["strength", "resilience", "discipline", "courage", "warrior", "foundation"],
    energy: "fierce", placement: "Back, thigh, or upper arm", visibility: "semi", areas: ["upper_back", "thigh", "upper_arm"], size: "medium",
    collageNote: "Lower back or thigh placement. Pure endurance energy.",
    famous: "Chosen by those in demanding physical or mental professions.",
    svg: `<svg viewBox="0 0 170 220" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="85" cy="130" rx="60" ry="70" stroke="currentColor" stroke-width="2.2"/><circle cx="85" cy="55" r="40" stroke="currentColor" stroke-width="2"/><circle cx="55" cy="32" r="14" stroke="currentColor" stroke-width="1.5"/><circle cx="115" cy="32" r="14" stroke="currentColor" stroke-width="1.5"/><circle cx="50" cy="25" r="3.5" fill="currentColor"/><circle cx="120" cy="25" r="3.5" fill="currentColor"/><circle cx="72" cy="60" r="5" fill="currentColor" opacity="0.5"/><circle cx="98" cy="60" r="5" fill="currentColor" opacity="0.5"/><path d="M72 72 Q80 85 88 78 Q96 85 104 72" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M45 95 L25 120 L40 115" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M125 95 L145 120 L130 115" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M55 165 L45 200 L55 190" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M115 165 L125 200 L115 190" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M75 185 L70 215" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M95 185 L100 215" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M50 100 L40 115 L48 110" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M120 100 L130 115 L122 110" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M65 75 L60 90 L68 85" stroke="currentColor" stroke-width="1" fill="none"/><path d="M105 75 L110 90 L102 85" stroke="currentColor" stroke-width="1" fill="none"/></svg>`
  },
  phaya_kumpee: {
    name: "Phaya Kumpee", thai: "พญากุมภีล์", meaning: "Sacred Crocodile",
    category: "animal", element: "water",
    description: "Endurance, hidden power, and victory through patience. The crocodile lurks, waits, and cannot be defeated by direct force. In Thai belief, it also carries mercy — it strikes with precision, never cruelly.",
    traits: ["resilience", "strength", "discipline", "warrior", "intuition", "courage"],
    energy: "fierce", placement: "Thigh, forearm, or lower back", visibility: "visible", areas: ["thigh", "forearm"], size: "medium",
    collageNote: "Horizontal placement — thigh or forearm. Rare and striking.",
    famous: "Traditional fighter's tattoo. Guards against injury.",
    svg: `<svg viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 50 Q50 30 120 40 Q180 30 230 50 Q180 70 120 60 Q50 70 15 50" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="35" cy="45" r="8" stroke="currentColor" stroke-width="1.4"/><circle cx="32" cy="42" r="2.5" fill="currentColor"/><path d="M15 45 Q8 38 10 55" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M15 55 Q6 48 8 60" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 50 L2 50" stroke="currentColor" stroke-width="1" fill="none"/><path d="M230 45 Q237 38 235 55" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M230 55 Q239 48 237 60" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M228 50 L238 50" stroke="currentColor" stroke-width="1" fill="none"/><path d="M60 35 L60 65 M80 33 L80 67 M100 32 L100 68 M120 32 L120 68 M140 33 L140 67 M160 35 L160 65 M180 38 L180 62" stroke="currentColor" stroke-width="1"/><path d="M40 50 Q45 55 50 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M70 50 Q75 55 80 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M100 50 Q105 55 110 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M130 50 Q135 55 140 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M160 50 Q165 55 170 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M190 50 Q195 55 200 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M55 50 Q50 45 45 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M85 50 Q80 45 75 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M115 50 Q110 45 105 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M145 50 Q140 45 135 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M175 50 Q170 45 165 50" stroke="currentColor" stroke-width="0.8" fill="none"/><path d="M205 50 Q200 45 195 50" stroke="currentColor" stroke-width="0.8" fill="none"/></svg>`
  },
  lotus: {
    name: "Bua Yant", thai: "บัวยันต์", meaning: "Sacred Lotus",
    category: "nature", element: "water",
    description: "The lotus rises from muddy water into perfect bloom — the definitive Buddhist symbol of purity, spiritual awakening, and enlightenment rising from suffering. For those who have been through something and come out changed.",
    traits: ["spirituality", "transformation", "rebirth", "wisdom", "tradition", "beauty"],
    energy: "elevated", placement: "Chest, forearm, or upper back", visibility: "visible", areas: ["chest", "forearm", "upper_back"], size: "small",
    collageNote: "Graceful accent piece — works beautifully alongside almost any other yant.",
    famous: "Universal Buddhist symbol — meaningful across all traditions.",
    svg: `<svg viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M90 200 Q90 150 90 90" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M70 190 Q65 205 75 210 Q85 215 95 210" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M110 190 Q105 205 115 210 Q125 215 135 210" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="60" cy="100" rx="18" ry="28" stroke="currentColor" stroke-width="1.8" transform="rotate(-45 60 100)" fill="none"/><ellipse cx="120" cy="100" rx="18" ry="28" stroke="currentColor" stroke-width="1.8" transform="rotate(45 120 100)" fill="none"/><ellipse cx="70" cy="60" rx="16" ry="26" stroke="currentColor" stroke-width="1.6" transform="rotate(-25 70 60)" fill="none"/><ellipse cx="110" cy="60" rx="16" ry="26" stroke="currentColor" stroke-width="1.6" transform="rotate(25 110 60)" fill="none"/><ellipse cx="45" cy="75" rx="14" ry="24" stroke="currentColor" stroke-width="1.5" transform="rotate(-70 45 75)" fill="none"/><ellipse cx="135" cy="75" rx="14" ry="24" stroke="currentColor" stroke-width="1.5" transform="rotate(70 135 75)" fill="none"/><path d="M90 80 L85 70 L90 65 L95 70 Z" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="90" cy="75" r="6" stroke="currentColor" stroke-width="1.2"/><circle cx="90" cy="75" r="3" fill="currentColor" opacity="0.3"/><path d="M80 82 Q90 88 100 82" stroke="currentColor" stroke-width="0.9" fill="none"/><path d="M70 90 Q90 98 110 90" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.6"/></svg>`
  },
  yant_sivali: {
    name: "Yant Sivali", thai: "ยันต์สีวลี", meaning: "Sivali — Monk of Fortune",
    category: "deity", element: "air",
    description: "Sivali was a disciple of Buddha renowned as the luckiest being who ever lived — the gods themselves would queue to offer him gifts. This yant invokes his extraordinary fortune, ensuring the wearer is always provided for and always in the right place at the right time.",
    traits: ["abundance", "luck", "manifestation", "joy", "community", "optimism"],
    energy: "magnetic", placement: "Chest or back", visibility: "semi", areas: ["chest", "upper_back"], size: "medium",
    collageNote: "Fortune piece — often placed on the chest, over the heart.",
    famous: "One of the most popular yants for attracting good luck and abundance.",
    svg: `<svg viewBox="0 0 160 240" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="45" r="32" stroke="currentColor" stroke-width="2"/><circle cx="80" cy="45" r="15" fill="currentColor" opacity="0.15"/><ellipse cx="65" cy="35" r="6" ry="10" stroke="currentColor" stroke-width="1.3"/><ellipse cx="95" cy="35" r="6" ry="10" stroke="currentColor" stroke-width="1.3"/><circle cx="62" cy="33" r="2.5" fill="currentColor"/><circle cx="98" cy="33" r="2.5" fill="currentColor"/><path d="M70 50 Q75 60 80 55 Q85 60 90 50" stroke="currentColor" stroke-width="1.4" fill="none"/><line x1="80" y1="77" x2="80" y2="160" stroke="currentColor" stroke-width="2"/><path d="M65 90 Q70 100 75 95 Q80 105 85 95 Q90 100 95 90" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="80" cy="145" rx="32" ry="16" stroke="currentColor" stroke-width="1.6"/><path d="M50 160 L80 152 L110 160" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/><path d="M60 175 L70 200 L65 185" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M100 175 L90 200 L95 185" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M80 160 L78 225 L82 225" stroke="currentColor" stroke-width="1" fill="none"/><path d="M40 110 Q35 125 40 145" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M120 110 Q125 125 120 145" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M50 85 L35 105" stroke="currentColor" stroke-width="1" fill="none"/><path d="M110 85 L125 105" stroke="currentColor" stroke-width="1" fill="none"/></svg>`
  },
  chat_petch: {
    name: "Chat Petch", thai: "เจ็ดเพชร", meaning: "Seven Diamonds",
    category: "geometric", element: "earth",
    description: "Seven rows of interconnected magical spells — the more powerful sibling of Hah Taew. All the spells weave together simultaneously. Blesses with success, charm, loving kindness, good luck, and protection from evil spirits all at once.",
    traits: ["protection", "luck", "charisma", "love", "completeness", "balance"],
    energy: "grounded", placement: "Upper back", visibility: "semi", areas: ["upper_back"], size: "medium",
    collageNote: "Often chosen as an upgrade from or alternative to Hah Taew.",
    famous: "The Hah Taew's more powerful, interconnected sibling.",
    svg: `<svg viewBox="0 0 200 270" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 30 L180 30" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="30" r="1.5" fill="currentColor"/><path d="M55 27 L55 33 M60 26 L60 34 M65 27 L65 33 M70 28 L70 32 M75 26 L75 34 M80 27 L80 33 M85 28 L85 32 M90 26 L90 34 M95 27 L95 33 M100 28 L100 32 M105 26 L105 34 M110 27 L110 33 M115 28 L115 32 M120 26 L120 34 M125 27 L125 33 M130 28 L130 32 M135 26 L135 34 M140 27 L140 33 M145 28 L145 32 M150 26 L150 34 M155 27 L155 33 M160 28 L160 32" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="30" r="1.5" fill="currentColor"/><path d="M20 75 L180 75" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="75" r="1.5" fill="currentColor"/><path d="M55 72 L55 78 M60 71 L60 79 M65 72 L65 78 M70 73 L70 77 M75 71 L75 79 M80 72 L80 78 M85 73 L85 77 M90 71 L90 79 M95 72 L95 78 M100 73 L100 77 M105 71 L105 79 M110 72 L110 78 M115 73 L115 77 M120 71 L120 79 M125 72 L125 78 M130 73 L130 77 M135 71 L135 79 M140 72 L140 78 M145 73 L145 77 M150 71 L150 79 M155 72 L155 78 M160 73 L160 77" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="75" r="1.5" fill="currentColor"/><path d="M20 120 L180 120" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="120" r="1.5" fill="currentColor"/><path d="M55 117 L55 123 M60 116 L60 124 M65 117 L65 123 M70 118 L70 122 M75 116 L75 124 M80 117 L80 123 M85 118 L85 122 M90 116 L90 124 M95 117 L95 123 M100 118 L100 122 M105 116 L105 124 M110 117 L110 123 M115 118 L115 122 M120 116 L120 124 M125 117 L125 123 M130 118 L130 122 M135 116 L135 124 M140 117 L140 123 M145 118 L145 122 M150 116 L150 124 M155 117 L155 123 M160 118 L160 122" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="120" r="1.5" fill="currentColor"/><path d="M20 165 L180 165" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="165" r="1.5" fill="currentColor"/><path d="M55 162 L55 168 M60 161 L60 169 M65 162 L65 168 M70 163 L70 167 M75 161 L75 169 M80 162 L80 168 M85 163 L85 167 M90 161 L90 169 M95 162 L95 168 M100 163 L100 167 M105 161 L105 169 M110 162 L110 168 M115 163 L115 167 M120 161 L120 169 M125 162 L125 168 M130 163 L130 167 M135 161 L135 169 M140 162 L140 168 M145 163 L145 167 M150 161 L150 169 M155 162 L155 168 M160 163 L160 167" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="165" r="1.5" fill="currentColor"/><path d="M20 210 L180 210" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="210" r="1.5" fill="currentColor"/><path d="M55 207 L55 213 M60 206 L60 214 M65 207 L65 213 M70 208 L70 212 M75 206 L75 214 M80 207 L80 213 M85 208 L85 212 M90 206 L90 214 M95 207 L95 213 M100 208 L100 212 M105 206 L105 214 M110 207 L110 213 M115 208 L115 212 M120 206 L120 214 M125 207 L125 213 M130 208 L130 212 M135 206 L135 214 M140 207 L140 213 M145 208 L145 212 M150 206 L150 214 M155 207 L155 213 M160 208 L160 212" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="210" r="1.5" fill="currentColor"/><path d="M20 255 L180 255" stroke="currentColor" stroke-width="1.8"/><circle cx="35" cy="255" r="1.5" fill="currentColor"/><path d="M55 252 L55 258 M60 251 L60 259 M65 252 L65 258 M70 253 L70 257 M75 251 L75 259 M80 252 L80 258 M85 253 L85 257 M90 251 L90 259 M95 252 L95 258 M100 253 L100 257 M105 251 L105 259 M110 252 L110 258 M115 253 L115 257 M120 251 L120 259 M125 252 L125 258 M130 253 L130 257 M135 251 L135 259 M140 252 L140 258 M145 253 L145 257 M150 251 L150 259 M155 252 L155 258 M160 253 L160 257" stroke="currentColor" stroke-width="0.8"/><circle cx="175" cy="255" r="1.5" fill="currentColor"/><polygon points="100,28 106,30 100,32 94,30" fill="currentColor" opacity="0.3"/><polygon points="100,73 106,75 100,77 94,75" fill="currentColor" opacity="0.3"/><polygon points="100,118 106,120 100,122 94,120" fill="currentColor" opacity="0.3"/><polygon points="100,163 106,165 100,167 94,165" fill="currentColor" opacity="0.3"/><polygon points="100,208 106,210 100,212 94,210" fill="currentColor" opacity="0.3"/><polygon points="100,253 106,255 100,257 94,255" fill="currentColor" opacity="0.3"/><line x1="50" y1="30" x2="50" y2="255" stroke="currentColor" stroke-width="0.6" opacity="0.3"/><line x1="150" y1="30" x2="150" y2="255" stroke="currentColor" stroke-width="0.6" opacity="0.3"/></svg>`
  },
  unaalome: {
    name: "Unaalome", thai: "อุณาโลม", meaning: "Path to Enlightenment",
    category: "geometric", element: "air",
    description: "The spiral at the base represents the wandering mind. The curves represent the ups and downs of life. The straight line at the top is the moment of enlightenment — the mind has found its path and no longer wavers. One of the most recognizable spiritual symbols in Southeast Asia.",
    traits: ["spirituality", "wisdom", "transformation", "balance", "tradition", "rebirth"],
    energy: "elevated", placement: "Chest, sternum, or behind the ear", visibility: "visible", areas: ["chest", "neck_spine", "forearm"], size: "small",
    collageNote: "Standalone accent piece. Beautiful behind the ear or along the sternum.",
    famous: "One of the most popular Sak Yant-inspired tattoos worldwide.",
    svg: `<svg viewBox="0 0 100 280" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 240 Q35 220 38 200 Q42 185 48 195 Q55 210 50 225 Q45 235 50 240" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M50 210 Q38 190 42 170 Q48 155 55 165 Q62 180 58 200 Q52 215 50 225" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M50 190 Q42 165 45 140 Q50 125 58 135 Q65 155 62 180 Q55 200 50 210" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M50 150 Q45 125 48 100 Q52 85 60 95 Q65 115 60 140 Q54 165 50 185" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M50 130 Q48 110 50 85 Q52 70 58 80 Q62 100 58 125 Q54 145 50 160" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M50 80 Q52 60 50 40 Q48 25 45 35 Q42 55 48 75 Q50 85 50 95" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M50 45 Q48 35 50 20 Q52 10 55 15 Q58 25 55 40" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="50" y1="15" x2="50" y2="5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="50" cy="3" r="1.5" fill="currentColor"/></svg>`
  },
  phra_pid_ta: {
    name: "Phra Pid Ta", thai: "พระปิดตา", meaning: "Closed Eyes Buddha",
    category: "deity", element: "earth",
    description: "A Buddha figure with hands covering the eyes — shutting out worldly temptation, greed, and evil. Represents the ultimate shielding from negative energy. Nothing bad can enter because the eyes refuse to see it.",
    traits: ["protection", "discipline", "spirituality", "balance", "wisdom", "resilience"],
    energy: "grounded", placement: "Back, chest, or upper arm", visibility: "semi", areas: ["upper_back", "chest", "upper_arm"], size: "medium",
    collageNote: "Protective guardian — pairs well with geometric yants for layered protection.",
    famous: "Extremely popular amulet and tattoo design. Found in every Thai temple.",
    svg: `<svg viewBox="0 0 170 220" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="85" cy="45" r="38" stroke="currentColor" stroke-width="2.2"/><circle cx="85" cy="45" r="18" fill="currentColor" opacity="0.12"/><ellipse cx="85" cy="135" rx="48" ry="60" stroke="currentColor" stroke-width="2.2"/><path d="M60 50 Q65 65 75 60 Q85 68 95 60 Q105 65 110 50" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/><path d="M70 35 Q75 25 85 28 Q95 25 100 35" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M60 85 Q70 95 85 90 Q100 95 110 85" stroke="currentColor" stroke-width="1.4" fill="none"/><ellipse cx="85" cy="135" rx="24" ry="30" stroke="currentColor" stroke-width="1.5" opacity="0.7"/><path d="M50 110 Q60 120 70 130" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M120 110 Q110 120 100 130" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M65 155 Q75 170 85 175" stroke="currentColor" stroke-width="1" fill="none"/><path d="M105 155 Q95 170 85 175" stroke="currentColor" stroke-width="1" fill="none"/><path d="M70 190 L65 215" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M100 190 L105 215" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="85" cy="45" r="8" fill="currentColor" opacity="0.25"/></svg>`
  },
  phra_phikanet: {
    name: "Phra Phikanet", thai: "พระพิฆเนศ", meaning: "Lord of Obstacles",
    category: "deity", element: "earth",
    description: "The elephant-headed god — remover of obstacles, patron of arts, sciences, and new beginnings. In Thai Buddhism, Ganesh is invoked before any new venture. He clears the path and blesses the journey forward.",
    traits: ["wisdom", "abundance", "creativity", "foundation", "spirituality", "luck"],
    energy: "grounded", placement: "Upper back or upper arm", visibility: "semi", areas: ["upper_back", "upper_arm"], size: "medium",
    collageNote: "Often placed at the start of a collection — the opener, the path-clearer.",
    famous: "Revered across Hindu and Buddhist traditions. Thailand's patron of the arts.",
    svg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="60" r="36" stroke="currentColor" stroke-width="2.2"/><path d="M75 50 L60 45 L65 58 L50 65" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/><path d="M125 50 L140 45 L135 58 L150 65" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/><path d="M80 40 Q90 30 100 32 Q110 30 120 40" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="90" cy="55" r="4.5" fill="currentColor"/><circle cx="110" cy="55" r="4.5" fill="currentColor"/><path d="M90 68 Q100 75 110 68" stroke="currentColor" stroke-width="1.4" fill="none"/><ellipse cx="100" cy="160" rx="55" ry="70" stroke="currentColor" stroke-width="2.2"/><path d="M60 110 Q45 130 50 165" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M140 110 Q155 130 150 165" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M75 95 Q70 110 75 130" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M125 95 Q130 110 125 130" stroke="currentColor" stroke-width="1.8" fill="none"/><ellipse cx="100" cy="160" rx="28" ry="35" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><path d="M80 190 L72 220 L80 210" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M120 190 L128 220 L120 210" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M100 210 L98 235" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="100" cy="160" r="14" fill="currentColor" opacity="0.2"/><path d="M60 155 Q65 165 70 158" stroke="currentColor" stroke-width="1" fill="none"/><path d="M140 155 Q135 165 130 158" stroke="currentColor" stroke-width="1" fill="none"/></svg>`
  },
  pla_tapian: {
    name: "Pla Tapian", thai: "ปลาตะเพียน", meaning: "Sacred Fish",
    category: "animal", element: "water",
    description: "Twin fish swimming in harmony — an ancient symbol of wealth flowing toward you. In Thai tradition, the Tapian fish swim upstream, representing perseverance and the ability to attract fortune through hard work and determination.",
    traits: ["abundance", "luck", "resilience", "adaptability", "manifestation", "balance"],
    energy: "magnetic", placement: "Forearm, calf, or lower back", visibility: "visible", areas: ["forearm", "calf", "center_back"], size: "small",
    collageNote: "Flowing accent piece — works beautifully on limbs following the muscle line.",
    famous: "Traditional Thai mobile hung above babies' cribs for prosperity.",
    svg: `<svg viewBox="0 0 250 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><path id="scale" d="M0 0 Q2 -1 4 0" stroke="currentColor" stroke-width="0.5"/></defs><circle cx="125" cy="100" r="80" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><circle cx="125" cy="100" r="60" stroke="currentColor" stroke-width="1" opacity="0.2"/><g><path d="M60 85 Q50 65 70 45 Q100 30 120 50 Q130 65 120 85" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="75" cy="50" r="4" fill="currentColor" opacity="0.5"/><path d="M70 80 L50 95" stroke="currentColor" stroke-width="1.8"/><path d="M70 80 L50 100" stroke="currentColor" stroke-width="1.8"/><path d="M70 80 L50 65" stroke="currentColor" stroke-width="1.8"/><g stroke="currentColor" stroke-width="0.8" opacity="0.6"><path d="M65 60 Q70 58 75 60"/><path d="M70 68 Q75 66 80 68"/><path d="M72 75 Q77 73 82 75"/><path d="M68 52 Q73 50 78 52"/><path d="M75 45 Q80 43 85 45"/><path d="M82 50 Q87 48 92 50"/><path d="M90 60 Q95 58 100 60"/><path d="M95 70 Q100 68 105 70"/></g><circle cx="68" cy="55" r="1.2" fill="currentColor"/><path d="M125 48 L140 35 L135 48 L140 55" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></g><g><path d="M190 85 Q200 65 180 45 Q150 30 130 50 Q120 65 130 85" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="175" cy="50" r="4" fill="currentColor" opacity="0.5"/><path d="M180 80 L200 95" stroke="currentColor" stroke-width="1.8"/><path d="M180 80 L200 100" stroke="currentColor" stroke-width="1.8"/><path d="M180 80 L200 65" stroke="currentColor" stroke-width="1.8"/><g stroke="currentColor" stroke-width="0.8" opacity="0.6"><path d="M185 60 Q180 58 175 60"/><path d="M180 68 Q175 66 170 68"/><path d="M178 75 Q173 73 168 75"/><path d="M182 52 Q177 50 172 52"/><path d="M175 45 Q170 43 165 45"/><path d="M168 50 Q163 48 158 50"/><path d="M160 60 Q155 58 150 60"/><path d="M155 70 Q150 68 145 70"/></g><circle cx="182" cy="55" r="1.2" fill="currentColor"/><path d="M125 48 L110 35 L115 48 L110 55" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></g><circle cx="60" cy="140" r="8" fill="currentColor" opacity="0.2"/><circle cx="190" cy="140" r="8" fill="currentColor" opacity="0.2"/><path d="M75 130 L80 155 L70 150 M185 130 L180 155 L190 150" stroke="currentColor" stroke-width="1" opacity="0.4"/></svg>`
  },
  singha: {
    name: "Singha", thai: "สิงห์", meaning: "Sacred Lion",
    category: "animal", element: "fire",
    description: "The mythical lion of Thai-Khmer tradition — royal authority, unshakable confidence, and majestic power. Unlike the tiger's ferocity, the lion represents dignified strength and the natural authority of a born leader.",
    traits: ["authority", "leadership", "courage", "strength", "ambition", "protection"],
    energy: "fierce", placement: "Chest, upper back, or upper arm", visibility: "semi", areas: ["chest", "upper_back", "upper_arm"], size: "large",
    collageNote: "Commanding piece — sits well on the chest or centered on the upper back.",
    famous: "The Singha is Thailand's most recognized mythical creature — see it on every beer bottle.",
    svg: `<svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg"><g><circle cx="125" cy="70" r="35" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.5" opacity="0.7"><path d="M90 70 Q70 60 55 75"/><path d="M160 70 Q180 60 195 75"/><path d="M90 70 Q70 80 55 85"/><path d="M160 70 Q180 80 195 85"/><path d="M85 50 Q65 35 50 40"/><path d="M165 50 Q185 35 200 40"/><path d="M85 50 Q65 65 50 70"/><path d="M165 50 Q185 65 200 70"/></g><circle cx="115" cy="60" r="6" fill="currentColor" opacity="0.4"/><circle cx="135" cy="60" r="6" fill="currentColor" opacity="0.4"/><circle cx="110" cy="58" r="2.5" fill="currentColor"/><circle cx="140" cy="58" r="2.5" fill="currentColor"/><path d="M120 75 Q125 82 130 75 Q128 84 125 88 Q122 84 120 75" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M110 85 L100 95 L105 90 L98 100" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M140 85 L150 95 L145 90 L152 100" stroke="currentColor" stroke-width="1.3" fill="none"/></g><ellipse cx="125" cy="150" rx="45" ry="55" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.2" opacity="0.6"><path d="M110 120 Q105 115 100 125"/><path d="M125 115 Q125 110 120 115"/><path d="M140 120 Q145 115 150 125"/><path d="M100 155 Q85 160 90 175"/><path d="M150 155 Q165 160 160 175"/></g><circle cx="125" cy="150" r="10" fill="currentColor" opacity="0.2"/><path d="M100 170 L95 200" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M150 170 L155 200" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M120 190 Q125 210 130 190" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>`
  },
  hong_thong: {
    name: "Hong Thong", thai: "หงส์ทอง", meaning: "Golden Swan",
    category: "animal", element: "air",
    description: "The Hamsa or golden swan — grace, elegance, and the ability to separate milk from water (truth from illusion). Represents discernment, beauty, and the refined mind that sees clearly through chaos.",
    traits: ["wisdom", "charisma", "intuition", "balance", "spirituality", "beauty"],
    energy: "elevated", placement: "Upper back, chest, or shoulder", visibility: "semi", areas: ["upper_back", "chest", "shoulder"], size: "medium",
    collageNote: "Elegant pairing with Sarika Koo or Bua Yant. Graceful energy.",
    famous: "Symbol of purity in both Hindu and Buddhist traditions.",
    svg: `<svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="50" r="22" stroke="currentColor" stroke-width="2"/><path d="M88 40 L75 15 L85 28" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M112 40 L125 15 L115 28" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M80 42 L65 35 L75 48" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M120 42 L135 35 L125 48" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="95" cy="48" r="2.5" fill="currentColor"/><circle cx="105" cy="48" r="2.5" fill="currentColor"/><path d="M98 58 Q100 68 102 58" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="100" cy="130" rx="35" ry="50" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.2" opacity="0.8"><path d="M80 90 Q60 110 65 150"/><path d="M120 90 Q140 110 135 150"/></g><g stroke="currentColor" stroke-width="1.3" opacity="0.7"><path d="M70 80 Q50 85 55 110"/><path d="M70 85 Q45 95 50 120"/><path d="M70 90 Q50 105 55 130"/><path d="M130 80 Q150 85 145 110"/><path d="M130 85 Q155 95 150 120"/><path d="M130 90 Q150 105 145 130"/></g><path d="M90 170 L80 220" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M110 170 L120 220" stroke="currentColor" stroke-width="1.5" fill="none"/><g stroke="currentColor" stroke-width="0.9" opacity="0.5"><path d="M65 120 Q50 135 60 160"/><path d="M70 125 Q55 145 65 170"/><path d="M135 120 Q150 135 140 160"/><path d="M130 125 Q145 145 135 170"/></g><circle cx="100" cy="130" r="15" fill="currentColor" opacity="0.15"/></svg>`
  },
  mangkorn: {
    name: "Mangkorn", thai: "มังกร", meaning: "Sacred Dragon",
    category: "animal", element: "fire",
    description: "The Thai-Chinese dragon — raw cosmic power, celestial authority, and control over the elements. Unlike Western dragons, the Asian dragon is a benevolent force of nature — rainfall, rivers, and the turning of seasons.",
    traits: ["strength", "authority", "ambition", "protection", "leadership", "courage"],
    energy: "fierce", placement: "Full back, side torso, or upper arm", visibility: "visible", areas: ["center_back", "upper_back", "upper_arm"], size: "large",
    collageNote: "Statement piece — typically flows along the back or wraps the torso.",
    famous: "Blends Thai and Chinese spiritual traditions. Popular with Sino-Thai communities.",
    svg: `<svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="35" r="18" stroke="currentColor" stroke-width="2"/><path d="M88 28 Q82 15 88 8 Q95 12 98 20" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M112 28 Q118 15 112 8 Q105 12 102 20" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M92 30 L82 40" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M108 30 L118 40" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="95" cy="35" r="1.5" fill="currentColor"/><circle cx="105" cy="35" r="1.5" fill="currentColor"/><path d="M100 52 Q80 70 85 100 Q90 130 110 150 Q120 165 100 180" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/><g stroke="currentColor" stroke-width="1.2" opacity="0.7"><circle cx="82" cy="75" r="4"/><circle cx="92" cy="95" r="4.5"/><circle cx="105" cy="115" r="4.5"/><circle cx="115" cy="135" r="4"/><circle cx="108" cy="160" r="3.5"/></g><path d="M70 85 L55 90 M70 90 L50 100" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M130 95 L150 100 M130 100 L155 110" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M85 130 L70 140 M85 135 L65 150" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M115 140 L130 150 M115 145 L135 160" stroke="currentColor" stroke-width="1.5" fill="none"/><g stroke="currentColor" stroke-width="0.8" opacity="0.6"><path d="M80 60 Q75 65 78 75"/><path d="M95 75 Q90 80 93 90"/><path d="M110 90 Q105 95 108 105"/><path d="M115 110 Q112 118 115 128"/><path d="M100 145 Q98 155 102 165"/></g><circle cx="60" cy="180" r="5" fill="currentColor" opacity="0.2"/><circle cx="140" cy="190" r="5" fill="currentColor" opacity="0.2"/><path d="M95 185 Q100 210 95 235" stroke="currentColor" stroke-width="1" fill="none" stroke-dasharray="3,2" opacity="0.5"/></svg>`
  },
  chang_erawan: {
    name: "Chang Erawan", thai: "ช้างเอราวัณ", meaning: "Three-Headed Elephant",
    category: "deity", element: "earth",
    description: "The celestial elephant mount of Indra — three heads representing heaven, earth, and the underworld. Symbol of immovable strength, royal power, and the ability to carry any burden without faltering.",
    traits: ["strength", "foundation", "protection", "leadership", "resilience", "wisdom"],
    energy: "grounded", placement: "Back or chest", visibility: "semi", areas: ["upper_back", "center_back", "chest"], size: "large",
    collageNote: "Massive centerpiece. Commands the back or chest with unshakable presence.",
    famous: "Erawan is the symbol of Thai royalty and the famous Bangkok shrine.",
    svg: `<svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="125" cy="190" rx="50" ry="35" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.6"><path d="M90 150 L75 210"/><path d="M120 155 L120 220"/><path d="M130 155 L130 220"/><path d="M160 150 L175 210"/></g><g stroke="currentColor" stroke-width="1.5" opacity="0.6"><rect x="80" y="175" width="15" height="25" fill="none"/><rect x="115" y="180" width="20" height="20" fill="none"/><rect x="125" y="180" width="20" height="20" fill="none"/><rect x="155" y="175" width="15" height="25" fill="none"/></g><g><circle cx="50" cy="70" r="25" stroke="currentColor" stroke-width="2"/><path d="M38 62 L28 42 L35 55" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M62 62 L72 42 L65 55" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M40 85 Q30 95 35 115" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M60 85 Q70 95 65 115" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="45" cy="65" r="2" fill="currentColor"/><circle cx="55" cy="65" r="2" fill="currentColor"/><path d="M48 72 L48 80" stroke="currentColor" stroke-width="1.2" fill="none"/><g stroke="currentColor" stroke-width="0.8" opacity="0.5"><path d="M42 70 L38 68"/><path d="M58 70 L62 68"/></g></g><g><circle cx="125" cy="65" r="25" stroke="currentColor" stroke-width="2"/><path d="M113 57 L103 37 L110 50" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M137 57 L147 37 L140 50" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M115 80 Q105 90 110 110" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M135 80 Q145 90 140 110" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="120" cy="60" r="2" fill="currentColor"/><circle cx="130" cy="60" r="2" fill="currentColor"/><path d="M123 67 L123 75" stroke="currentColor" stroke-width="1.2" fill="none"/><g stroke="currentColor" stroke-width="0.8" opacity="0.5"><path d="M117 65 L113 63"/><path d="M133 65 L137 63"/></g></g><g><circle cx="200" cy="70" r="25" stroke="currentColor" stroke-width="2"/><path d="M188 62 L178 42 L185 55" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M212 62 L222 42 L215 55" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M190 85 Q180 95 185 115" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M210 85 Q220 95 215 115" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="195" cy="65" r="2" fill="currentColor"/><circle cx="205" cy="65" r="2" fill="currentColor"/><path d="M198 72 L198 80" stroke="currentColor" stroke-width="1.2" fill="none"/><g stroke="currentColor" stroke-width="0.8" opacity="0.5"><path d="M192 70 L188 68"/><path d="M208 70 L212 68"/></g></g><g stroke="currentColor" stroke-width="1.2" opacity="0.4"><path d="M75 110 Q70 130 80 150"/><path d="M175 110 Q180 130 170 150"/></g></svg>`
  },
  yant_na: {
    name: "Yant Na", thai: "ยันต์นะ", meaning: "The Na Yant",
    category: "geometric", element: "water",
    description: "The most versatile yant — built around the Thai letter 'Na' (นะ). Hundreds of variations exist, each carrying different blessings. The Na yant is the canvas of the tradition — protection, love, luck, and power all compressed into one sacred letter.",
    traits: ["protection", "love", "charisma", "luck", "adaptability", "tradition"],
    energy: "magnetic", placement: "Forehead (by monks), chest, or forearm", visibility: "visible", areas: ["chest", "forearm"], size: "small",
    collageNote: "Small but powerful. Stands alone or nestles between larger yants.",
    famous: "The foundation of Sak Yant script work. Every ajarn learns this first.",
    svg: `<svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="125" r="85" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><circle cx="100" cy="125" r="65" stroke="currentColor" stroke-width="1" opacity="0.2"/><path d="M50 60 Q70 50 100 55 Q130 50 150 60" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="45" y1="80" x2="155" y2="80" stroke="currentColor" stroke-width="2"/><line x1="48" y1="90" x2="152" y2="90" stroke="currentColor" stroke-width="1.5" opacity="0.7"/><line x1="50" y1="100" x2="150" y2="100" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><path d="M55 125 Q100 150 145 125" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M60 135 Q100 155 140 135" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="100" cy="170" r="15" stroke="currentColor" stroke-width="1.8"/><circle cx="100" cy="170" r="8" fill="currentColor" opacity="0.25"/><g stroke="currentColor" stroke-width="0.8" opacity="0.5"><path d="M75 110 Q85 120 95 115"/><path d="M125 115 Q135 120 145 110"/><path d="M70 135 Q80 145 90 140"/><path d="M110 140 Q120 145 130 135"/></g><polygon points="100,185 110,205 90,205" stroke="currentColor" stroke-width="1.5" fill="none"/><polygon points="100,205 105,220 95,220" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.7"/><line x1="85" y1="60" x2="115" y2="60" stroke="currentColor" stroke-width="1" opacity="0.4"/><line x1="80" y1="125" x2="120" y2="125" stroke="currentColor" stroke-width="1" opacity="0.4"/></svg>`
  },
  yant_maha_ut: {
    name: "Yant Maha Ut", thai: "ยันต์มหาอุด", meaning: "The Great Stopper",
    category: "geometric", element: "earth",
    description: "A sealing yant — literally 'stops' negative forces from entering the body. Works like a spiritual lock: once applied, it seals the wearer's energy field. Traditionally believed to stop bullets and blades.",
    traits: ["protection", "resilience", "warrior", "foundation", "discipline", "strength"],
    energy: "grounded", placement: "Back of neck, chest, or upper back", visibility: "hidden", areas: ["neck_spine", "chest", "upper_back"], size: "small",
    collageNote: "Sealing piece — often the final yant applied, locking in all others.",
    famous: "Soldiers and police request this yant before entering danger.",
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="30" width="140" height="140" stroke="currentColor" stroke-width="2"/><rect x="45" y="45" width="110" height="110" stroke="currentColor" stroke-width="1.5" opacity="0.7"/><rect x="60" y="60" width="80" height="80" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><circle cx="100" cy="100" r="30" stroke="currentColor" stroke-width="1.8"/><circle cx="100" cy="100" r="18" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.25"/><line x1="30" y1="100" x2="170" y2="100" stroke="currentColor" stroke-width="1.5"/><line x1="100" y1="30" x2="100" y2="170" stroke="currentColor" stroke-width="1.5"/><g stroke="currentColor" stroke-width="0.8" opacity="0.6"><line x1="45" y1="100" x2="60" y2="100"/><line x1="140" y1="100" x2="155" y2="100"/><line x1="100" y1="45" x2="100" y2="60"/><line x1="100" y1="140" x2="100" y2="155"/></g><polygon points="100,25 105,35 95,35" stroke="currentColor" stroke-width="1.5" fill="currentColor" opacity="0.3"/><polygon points="100,175 105,165 95,165" stroke="currentColor" stroke-width="1.5" fill="currentColor" opacity="0.3"/><polygon points="25,100 35,105 35,95" stroke="currentColor" stroke-width="1.5" fill="currentColor" opacity="0.3"/><polygon points="175,100 165,105 165,95" stroke="currentColor" stroke-width="1.5" fill="currentColor" opacity="0.3"/><g stroke="currentColor" stroke-width="1" opacity="0.5"><path d="M60 60 L80 80 M140 140 L120 120"/><path d="M140 60 L120 80 M60 140 L80 120"/></g></svg>`
  },
  metta_mahaniyom: {
    name: "Metta Mahaniyom", thai: "ยันต์เมตตามหานิยม", meaning: "Loving Kindness",
    category: "geometric", element: "air",
    description: "The yant of metta — universal loving kindness. Makes the wearer beloved by all who meet them. People will want to help you, doors will open, strangers will trust you. The gentlest but perhaps most powerful force in the tradition.",
    traits: ["charisma", "love", "community", "communication", "joy", "abundance"],
    energy: "magnetic", placement: "Chest or tongue (by monks)", visibility: "semi", areas: ["chest", "upper_back"], size: "medium",
    collageNote: "Heart piece — pairs beautifully with Sarika Koo or Sivali.",
    famous: "The most requested yant for those in business, sales, or public life.",
    svg: `<svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="75" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><circle cx="100" cy="100" r="55" stroke="currentColor" stroke-width="1.2" opacity="0.2"/><path d="M100 30 Q120 55 110 85 Q105 105 100 130 Q95 105 90 85 Q80 55 100 30" stroke="currentColor" stroke-width="2.2" fill="none"/><circle cx="100" cy="60" r="8" fill="currentColor" opacity="0.2"/><path d="M55 85 Q40 105 50 140 Q60 120 75 95 Q65 70 55 85" stroke="currentColor" stroke-width="2.2" fill="none"/><circle cx="60" cy="105" r="8" fill="currentColor" opacity="0.2"/><path d="M145 85 Q160 105 150 140 Q140 120 125 95 Q135 70 145 85" stroke="currentColor" stroke-width="2.2" fill="none"/><circle cx="140" cy="105" r="8" fill="currentColor" opacity="0.2"/><g stroke="currentColor" stroke-width="1" opacity="0.5"><path d="M85 75 Q90 80 95 75"/><path d="M105 75 Q110 80 115 75"/><path d="M70 100 Q75 105 80 100"/><path d="M120 100 Q125 105 130 100"/><path d="M90 120 Q95 125 100 120"/><path d="M100 120 Q105 125 110 120"/></g><g stroke="currentColor" stroke-width="0.8" opacity="0.4"><path d="M100 50 L100 70"/><path d="M50 100 L70 100"/><path d="M150 100 L170 100"/><path d="M75 150 L100 170"/><path d="M125 150 L100 170"/></g><circle cx="100" cy="180" r="12" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="100" cy="180" r="6" fill="currentColor" opacity="0.2"/><path d="M100 190 Q105 210 100 225" stroke="currentColor" stroke-width="1" opacity="0.5"/></svg>`
  },
  maha_amnaj: {
    name: "Maha Amnaj", thai: "ยันต์มหาอำนาจ", meaning: "Great Authority",
    category: "geometric", element: "fire",
    description: "Bestows commanding authority and influence. People will listen when you speak, respect your decisions, and follow your lead. Not domination — authentic authority born from spiritual power.",
    traits: ["authority", "leadership", "courage", "discipline", "ambition", "strength"],
    energy: "fierce", placement: "Upper back or chest", visibility: "semi", areas: ["upper_back", "chest"], size: "medium",
    collageNote: "Power piece — often paired with Suea Koo or Gao Yord.",
    famous: "Favored by military officers, judges, and those in positions of command.",
    svg: `<svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 15 L120 50 L105 40 L130 80 L100 60 L125 110 L100 95 L100 145" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M100 15 L80 50 L95 40 L70 80 L100 60 L75 110 L100 95" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/><polygon points="100,150 110,170 90,170" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.25"/><circle cx="100" cy="20" r="8" fill="currentColor" opacity="0.3"/><g stroke="currentColor" stroke-width="1.2" opacity="0.6"><path d="M80 70 Q70 85 75 105"/><path d="M120 70 Q130 85 125 105"/></g><g stroke="currentColor" stroke-width="0.8" opacity="0.5"><line x1="85" y1="45" x2="75" y2="55"/><line x1="115" y1="45" x2="125" y2="55"/><line x1="75" y1="90" x2="60" y2="105"/><line x1="125" y1="90" x2="140" y2="105"/></g><circle cx="100" cy="100" r="25" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><path d="M100 175 L100 220" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M90 180 Q100 195 110 180" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.6"/></svg>`
  },
  phra_lersi: {
    name: "Phra Lersi", thai: "พระฤๅษี", meaning: "The Hermit Sage",
    category: "deity", element: "water",
    description: "The hermit sage — master of herbs, healing, and ancient knowledge. Lersi are the original teachers of Sak Yant, predating even Buddhist monks in the tradition. Represents deep wisdom gained through solitude, meditation, and connection to nature.",
    traits: ["wisdom", "intuition", "spirituality", "tradition", "depth", "transformation"],
    energy: "transformative", placement: "Upper back or upper arm", visibility: "semi", areas: ["upper_back", "upper_arm"], size: "medium",
    collageNote: "The teacher piece — honors the lineage and the tradition itself.",
    famous: "Lersi Phra Narot is considered the father of all Sak Yant masters.",
    svg: `<svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="50" r="28" stroke="currentColor" stroke-width="2"/><path d="M85 35 L65 10 L80 30" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M115 35 L135 10 L120 30" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><g stroke="currentColor" stroke-width="1.2" opacity="0.7"><path d="M80 45 L60 40 L75 55"/><path d="M120 45 L140 40 L125 55"/></g><path d="M90 55 L75 75" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M110 55 L125 75" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="95" cy="48" r="2" fill="currentColor"/><circle cx="105" cy="48" r="2" fill="currentColor"/><path d="M98 62 Q100 72 102 62" stroke="currentColor" stroke-width="1.3" fill="none"/><ellipse cx="100" cy="140" rx="40" ry="55" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.3" opacity="0.7"><path d="M70 100 Q50 125 60 160"/><path d="M130 100 Q150 125 140 160"/></g><path d="M85 170 Q90 195 95 215" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M115 170 Q110 195 105 215" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M100 75 Q95 95 100 115" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/><g stroke="currentColor" stroke-width="0.8" opacity="0.4"><path d="M65 140 Q55 155 65 175"/><path d="M135 140 Q145 155 135 175"/></g></svg>`
  },
  kinnari: {
    name: "Kinnari", thai: "กินรี", meaning: "Celestial Maiden",
    category: "deity", element: "air",
    description: "Half-woman, half-bird — a celestial being of the Himaphan forest. Represents otherworldly grace, divine beauty, and the ability to move between worlds. In Thai mythology, the Kinnari's song can heal any wound.",
    traits: ["beauty", "charisma", "love", "freedom", "spirituality", "joy"],
    energy: "elevated", placement: "Back, thigh, or upper arm", visibility: "semi", areas: ["upper_back", "thigh", "upper_arm"], size: "medium",
    collageNote: "Graceful flowing piece. Beautiful on the shoulder blade or outer thigh.",
    famous: "The Kinnari is one of Thailand's most beloved mythological creatures.",
    svg: `<svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="50" r="25" stroke="currentColor" stroke-width="2"/><path d="M80 40 L60 20 L75 35" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M120 40 L140 20 L125 35" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M75 45 Q60 55 65 75" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M125 45 Q140 55 135 75" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="95" cy="48" r="2.5" fill="currentColor"/><circle cx="105" cy="48" r="2.5" fill="currentColor"/><path d="M98 62 Q100 72 102 62" stroke="currentColor" stroke-width="1.3" fill="none"/><ellipse cx="100" cy="145" rx="45" ry="65" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.5" opacity="0.8"><path d="M70 100 Q50 125 55 170"/><path d="M130 100 Q150 125 145 170"/></g><g stroke="currentColor" stroke-width="1.2" opacity="0.7"><path d="M65 95 Q45 110 50 145"/><path d="M65 100 Q40 120 45 160"/><path d="M65 105 Q45 135 52 180"/><path d="M135 95 Q155 110 150 145"/><path d="M135 100 Q160 120 155 160"/><path d="M135 105 Q155 135 148 180"/></g><path d="M90 200 L80 235" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M110 200 L120 235" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="100" cy="145" r="18" fill="currentColor" opacity="0.15"/></svg>`
  },
  mae_thorani: {
    name: "Mae Thorani", thai: "แม่ธรณี", meaning: "Earth Goddess",
    category: "deity", element: "earth",
    description: "The goddess who wrung floodwaters from her hair to wash away Mara's demon army during Buddha's enlightenment. Represents feminine power, the earth's protection, and the strength of quiet devotion that defeats evil without violence.",
    traits: ["protection", "devotion", "foundation", "strength", "spirituality", "resilience"],
    energy: "grounded", placement: "Back or upper arm", visibility: "semi", areas: ["upper_back", "center_back", "upper_arm"], size: "large",
    collageNote: "Powerful feminine energy — stands alone or anchors a larger collection.",
    famous: "Found at the base of nearly every Buddha statue in Thailand.",
    svg: `<svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="60" r="30" stroke="currentColor" stroke-width="2"/><path d="M80 50 L65 25 L78 40" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M120 50 L135 25 L122 40" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M75 65 Q55 80 60 115" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M125 65 Q145 80 140 115" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="95" cy="55" r="2.5" fill="currentColor"/><circle cx="105" cy="55" r="2.5" fill="currentColor"/><ellipse cx="100" cy="160" rx="50" ry="70" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.3" opacity="0.8"><path d="M75 95 Q65 110 70 150 Q75 180 85 220"/><path d="M125 95 Q135 110 130 150 Q125 180 115 220"/></g><g stroke="currentColor" stroke-width="1" opacity="0.6"><path d="M70 115 Q55 135 60 170 Q70 200 80 240"/><path d="M70 120 Q50 145 55 180 Q68 215 78 255"/><path d="M130 115 Q145 135 140 170 Q130 200 120 240"/><path d="M130 120 Q150 145 145 180 Q132 215 122 255"/></g><circle cx="100" cy="160" r="20" fill="currentColor" opacity="0.15"/><path d="M90 105 Q100 125 110 105" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.6"/></svg>`
  },
  tao_wessuwan: {
    name: "Tao Wessuwan", thai: "ท้าวเวสสุวรรณ", meaning: "Guardian of the North",
    category: "deity", element: "fire",
    description: "The giant king — one of the four heavenly guardians, ruler of the northern realm and commander of yakshas. Bestows authority, wealth, and absolute protection from evil spirits. His image alone sends demons fleeing.",
    traits: ["protection", "authority", "strength", "warrior", "abundance", "courage"],
    energy: "fierce", placement: "Back or chest", visibility: "semi", areas: ["upper_back", "center_back", "chest"], size: "large",
    collageNote: "Guardian piece — traditionally faces outward on the back to ward off evil.",
    famous: "One of the most powerful protective figures in Thai spiritual tradition.",
    svg: `<svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="60" r="32" stroke="currentColor" stroke-width="2.2"/><path d="M75 48 L55 20 L72 38" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M125 48 L145 20 L128 38" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><g stroke="currentColor" stroke-width="1.4" opacity="0.7"><path d="M70 50 L50 42 L65 62"/><path d="M130 50 L150 42 L135 62"/></g><ellipse cx="100" cy="160" rx="55" ry="75" stroke="currentColor" stroke-width="2.2"/><path d="M58 78 Q35 105 42 160 Q50 210 60 260" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M142 78 Q165 105 158 160 Q150 210 140 260" stroke="currentColor" stroke-width="1.8" fill="none"/><g stroke="currentColor" stroke-width="1.5" opacity="0.6"><line x1="70" y1="160" x2="130" y2="160"/><line x1="68" y1="175" x2="132" y2="175"/><line x1="70" y1="190" x2="130" y2="190"/></g><path d="M85 120 L70 140" stroke="currentColor" stroke-width="2" fill="none"/><path d="M115 120 L130 140" stroke="currentColor" stroke-width="2" fill="none"/><g stroke="currentColor" stroke-width="1" opacity="0.5"><path d="M90 100 Q80 110 85 130"/><path d="M110 100 Q120 110 115 130"/></g><circle cx="100" cy="160" r="22" fill="currentColor" opacity="0.15"/><path d="M95 65 Q100 50 105 65" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.6"/></svg>`
  },
  jing_jok: {
    name: "Jing Jok", thai: "จิ้งจก", meaning: "Sacred Gecko",
    category: "animal", element: "water",
    description: "The gecko's call is one of the most common sounds in Thailand — and hearing it is an omen of good luck. The gecko yant attracts fortune, charm, and opportunity. Small but persistent, it clings to surfaces nothing else can grip.",
    traits: ["luck", "adaptability", "charisma", "resilience", "manifestation", "community"],
    energy: "magnetic", placement: "Forearm, ankle, or shoulder", visibility: "visible", areas: ["forearm", "shoulder", "calf"], size: "small",
    collageNote: "Small charm piece — perfect for wrists, ankles, or tucked into a larger collection.",
    famous: "Thai superstition says a gecko calling 7 times brings tremendous luck.",
    svg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="60" r="28" stroke="currentColor" stroke-width="2"/><circle cx="85" cy="50" r="5" fill="currentColor" opacity="0.3"/><circle cx="115" cy="50" r="5" fill="currentColor" opacity="0.3"/><circle cx="82" cy="50" r="2" fill="currentColor"/><circle cx="118" cy="50" r="2" fill="currentColor"/><path d="M95 70 Q85 80 82 105 Q80 125 88 145" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M105 70 Q115 80 118 105 Q120 125 112 145" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M65 100 Q45 110 42 140 Q40 165 55 185" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M135 100 Q155 110 158 140 Q160 165 145 185" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><g stroke="currentColor" stroke-width="0.8" opacity="0.6"><circle cx="75" cy="120" r="3"/><circle cx="90" cy="135" r="3"/><circle cx="125" cy="130" r="3"/><circle cx="140" cy="150" r="3"/></g><path d="M82 145 Q75 165 80 190" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.7"/><path d="M118 145 Q125 165 120 190" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.7"/><path d="M55 185 Q50 210 55 235" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.7"/><path d="M145 185 Q150 210 145 235" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.7"/><g stroke="currentColor" stroke-width="0.6" opacity="0.4"><path d="M60 90 Q55 100 60 110"/><path d="M140 90 Q145 100 140 110"/></g></svg>`
  },
  phra_phrom: {
    name: "Phra Phrom", thai: "พระพรหม", meaning: "Four-Faced Brahma",
    category: "deity", element: "air",
    description: "The four-faced creator god — each face blessing a cardinal direction with different gifts: career success, love, health, and wisdom. The Erawan Shrine in Bangkok dedicated to Phra Phrom is one of the most visited sites in Thailand.",
    traits: ["abundance", "completeness", "wisdom", "protection", "luck", "spirituality"],
    energy: "elevated", placement: "Back or chest", visibility: "semi", areas: ["upper_back", "chest"], size: "large",
    collageNote: "Centerpiece deity — commands respect and space in any collection.",
    famous: "The Erawan Shrine to Phra Phrom in Bangkok draws millions of visitors yearly.",
    svg: `<svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg"><g><circle cx="60" cy="60" r="22" stroke="currentColor" stroke-width="1.8"/><circle cx="140" cy="60" r="22" stroke="currentColor" stroke-width="1.8"/><circle cx="60" cy="160" r="22" stroke="currentColor" stroke-width="1.8"/><circle cx="140" cy="160" r="22" stroke="currentColor" stroke-width="1.8"/></g><g stroke="currentColor" stroke-width="1.2" opacity="0.7"><circle cx="55" cy="55" r="2" fill="currentColor"/><circle cx="65" cy="55" r="2" fill="currentColor"/><circle cx="55" cy="65" r="2" fill="currentColor"/><circle cx="65" cy="65" r="2" fill="currentColor"/><circle cx="135" cy="55" r="2" fill="currentColor"/><circle cx="145" cy="55" r="2" fill="currentColor"/><circle cx="135" cy="65" r="2" fill="currentColor"/><circle cx="145" cy="65" r="2" fill="currentColor"/><circle cx="55" cy="155" r="2" fill="currentColor"/><circle cx="65" cy="155" r="2" fill="currentColor"/><circle cx="55" cy="165" r="2" fill="currentColor"/><circle cx="65" cy="165" r="2" fill="currentColor"/><circle cx="135" cy="155" r="2" fill="currentColor"/><circle cx="145" cy="155" r="2" fill="currentColor"/><circle cx="135" cy="165" r="2" fill="currentColor"/><circle cx="145" cy="165" r="2" fill="currentColor"/></g><line x1="60" y1="82" x2="60" y2="138" stroke="currentColor" stroke-width="1.5" opacity="0.7"/><line x1="140" y1="82" x2="140" y2="138" stroke="currentColor" stroke-width="1.5" opacity="0.7"/><line x1="82" y1="60" x2="118" y2="60" stroke="currentColor" stroke-width="1.5" opacity="0.7"/><line x1="82" y1="160" x2="118" y2="160" stroke="currentColor" stroke-width="1.5" opacity="0.7"/><ellipse cx="100" cy="110" rx="28" ry="45" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.3" opacity="0.6"><path d="M85 100 L70 110 L80 125"/><path d="M115 100 L130 110 L120 125"/><path d="M85 120 L70 135 L80 145"/><path d="M115 120 L130 135 L120 145"/></g><g stroke="currentColor" stroke-width="1" opacity="0.5"><path d="M75 70 Q65 80 72 95"/><path d="M125 70 Q135 80 128 95"/><path d="M75 150 Q65 160 72 175"/><path d="M125 150 Q135 160 128 175"/></g><circle cx="100" cy="110" r="15" fill="currentColor" opacity="0.15"/></svg>`
  },
  trinisinghe: {
    name: "Trinisinghe", thai: "ยันต์ตรีนิสิงเห", meaning: "Three Guardians",
    category: "geometric", element: "earth",
    description: "Three interlocking circles representing Buddha, Dhamma, and Sangha — the Triple Gem. Each circle reinforces the others, creating unbreakable spiritual protection. The holy trinity of Buddhist faith worn on the skin.",
    traits: ["protection", "spirituality", "tradition", "balance", "completeness", "foundation"],
    energy: "grounded", placement: "Upper back or chest", visibility: "semi", areas: ["upper_back", "chest"], size: "medium",
    collageNote: "Foundation yant — often paired with Hah Taew or Gao Yord.",
    famous: "Represents the core of Buddhist faith: Buddha, Dhamma, Sangha.",
    svg: `<svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="75" cy="85" r="50" stroke="currentColor" stroke-width="2"/><circle cx="125" cy="85" r="50" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="150" r="50" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.2" opacity="0.6"><circle cx="75" cy="85" r="30" fill="none"/><circle cx="125" cy="85" r="30" fill="none"/><circle cx="100" cy="150" r="30" fill="none"/></g><g stroke="currentColor" stroke-width="0.8" opacity="0.4"><circle cx="75" cy="85" r="15" fill="none"/><circle cx="125" cy="85" r="15" fill="none"/><circle cx="100" cy="150" r="15" fill="none"/></g><circle cx="100" cy="90" r="12" fill="currentColor" opacity="0.25"/><g stroke="currentColor" stroke-width="1" opacity="0.5"><line x1="60" y1="85" x2="40" y2="85"/><line x1="140" y1="85" x2="160" y2="85"/><line x1="85" y1="135" x2="70" y2="165"/><line x1="115" y1="135" x2="130" y2="165"/><line x1="100" y1="200" x2="100" y2="220"/></g><g stroke="currentColor" stroke-width="0.6" opacity="0.3"><path d="M70 65 Q75 70 80 65"/><path d="M120 65 Q125 70 130 65"/><path d="M85 165 Q100 180 115 165"/></g></svg>`
  },
  maa_sep_nang: {
    name: "Maa Sep Nang", thai: "ม้าเสพนาง", meaning: "Charming Horse",
    category: "animal", element: "fire",
    description: "A mythical horse that represents irresistible sexual magnetism and romantic attraction. One of the more provocative yants — unapologetically about desire, passion, and the power to attract lovers.",
    traits: ["charisma", "love", "courage", "independence", "joy", "manifestation"],
    energy: "magnetic", placement: "Thigh, hip, or lower back", visibility: "hidden", areas: ["thigh", "center_back"], size: "medium",
    collageNote: "Private placement — traditionally kept intimate and hidden.",
    famous: "One of the more controversial and sought-after 'charm' yants.",
    svg: `<svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="55" r="30" stroke="currentColor" stroke-width="2"/><path d="M80 42 L65 15 L78 35" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M120 42 L135 15 L122 35" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M75 65 Q60 85 65 120" stroke="currentColor" stroke-width="1.8" fill="none"/><path d="M125 65 Q140 85 135 120" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="95" cy="50" r="2.5" fill="currentColor"/><circle cx="105" cy="50" r="2.5" fill="currentColor"/><path d="M98 68 Q100 80 102 68" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="100" cy="160" rx="45" ry="60" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.5" opacity="0.8"><path d="M70 110 Q50 135 55 180 Q65 215 78 245"/><path d="M130 110 Q150 135 145 180 Q135 215 122 245"/></g><g stroke="currentColor" stroke-width="1.2" opacity="0.7"><path d="M100 120 Q85 145 90 185 Q100 220 105 245"/></g><g stroke="currentColor" stroke-width="0.8" opacity="0.5"><path d="M65 130 Q50 150 58 190"/><path d="M65 135 Q45 160 55 205"/><path d="M135 130 Q150 150 142 190"/><path d="M135 135 Q155 160 145 205"/></g><circle cx="100" cy="160" r="18" fill="currentColor" opacity="0.15"/><g stroke="currentColor" stroke-width="1" opacity="0.6"><path d="M85 100 Q75 110 80 125"/><path d="M115 100 Q125 110 120 125"/></g></svg>`
  },
  choke_laap: {
    name: "Choke Laap", thai: "ยันต์โชคลาภ", meaning: "Fortune & Prosperity",
    category: "geometric", element: "air",
    description: "A yantra grid specifically designed to channel wealth, opportunities, and auspicious timing toward the wearer. Where Sivali attracts general good fortune, Choke Laap is laser-focused on material prosperity and career success.",
    traits: ["abundance", "luck", "manifestation", "ambition", "optimism", "leadership"],
    energy: "magnetic", placement: "Chest, forearm, or upper back", visibility: "visible", areas: ["chest", "forearm", "upper_back"], size: "small",
    collageNote: "Prosperity piece — pairs well with Sivali or Mongkol for amplified luck.",
    famous: "Requested by entrepreneurs and traders before major business ventures.",
    svg: `<svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="30" width="140" height="140" stroke="currentColor" stroke-width="2"/><rect x="45" y="45" width="110" height="110" stroke="currentColor" stroke-width="1.6" opacity="0.7"/><rect x="60" y="60" width="80" height="80" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><rect x="75" y="75" width="50" height="50" stroke="currentColor" stroke-width="1" opacity="0.3"/><line x1="30" y1="100" x2="170" y2="100" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><line x1="100" y1="30" x2="100" y2="170" stroke="currentColor" stroke-width="1.2" opacity="0.5"/><g stroke="currentColor" stroke-width="0.8" opacity="0.4"><line x1="45" y1="100" x2="60" y2="100"/><line x1="140" y1="100" x2="155" y2="100"/><line x1="100" y1="45" x2="100" y2="60"/><line x1="100" y1="140" x2="100" y2="155"/></g><circle cx="100" cy="100" r="30" stroke="currentColor" stroke-width="1.8" opacity="0.6"/><circle cx="100" cy="100" r="18" stroke="currentColor" stroke-width="1.2" opacity="0.4"/><circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.3"/><g stroke="currentColor" stroke-width="0.6" opacity="0.3"><circle cx="70" cy="70" r="4" fill="none"/><circle cx="130" cy="70" r="4" fill="none"/><circle cx="70" cy="130" r="4" fill="none"/><circle cx="130" cy="130" r="4" fill="none"/></g><g stroke="currentColor" stroke-width="1" opacity="0.5"><path d="M100 30 L95 15 L100 22 L105 15"/><path d="M100 170 L95 185 L100 178 L105 185"/><path d="M30 100 L15 95 L22 100 L15 105"/><path d="M170 100 L185 95 L178 100 L185 105"/></g></svg>`
  },
  phra_sangkachai: {
    name: "Phra Sangkachai", thai: "พระสังกัจจายน์", meaning: "The Laughing Monk",
    category: "deity", element: "air",
    description: "The jolly, rotund monk — blessed with such intense metta that his beauty once rivaled the Buddha's. He intentionally transformed his appearance to avoid distraction. Represents effortless abundance, good humor, and the kind of luck that comes from genuine warmth.",
    traits: ["abundance", "joy", "charisma", "luck", "community", "love"],
    energy: "magnetic", placement: "Chest or upper arm", visibility: "semi", areas: ["chest", "upper_arm"], size: "medium",
    collageNote: "Joyful piece — brings lightness to any collection.",
    famous: "Often confused with the Chinese 'Laughing Buddha' but distinct in Thai tradition.",
    svg: `<svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="60" r="32" stroke="currentColor" stroke-width="2"/><path d="M85 50 Q100 60 115 50" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="90" cy="55" r="3" fill="currentColor"/><circle cx="110" cy="55" r="3" fill="currentColor"/><path d="M95 68 Q100 78 105 68" stroke="currentColor" stroke-width="1.3" fill="none"/><ellipse cx="100" cy="155" rx="50" ry="70" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.5" opacity="0.7"><circle cx="100" cy="155" r="35" fill="none"/><circle cx="100" cy="155" r="20" fill="none"/></g><circle cx="100" cy="155" r="8" fill="currentColor" opacity="0.3"/><path d="M75 110 Q60 140 70 185" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M125 110 Q140 140 130 185" stroke="currentColor" stroke-width="1.6" fill="none"/><g stroke="currentColor" stroke-width="1.2" opacity="0.6"><path d="M70 185 L60 220"/><path d="M130 185 L140 220"/></g><g stroke="currentColor" stroke-width="0.8" opacity="0.5"><path d="M85 95 Q75 105 80 120"/><path d="M115 95 Q125 105 120 120"/><path d="M100 215 L95 240"/><path d="M100 215 L105 240"/></g><path d="M80 145 Q100 165 120 145" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.6"/><circle cx="100" cy="60" r="10" fill="currentColor" opacity="0.1"/></svg>`
  },
  salika_lin_thong: {
    name: "Salika Lin Thong", thai: "สาลิกาลิ้นทอง", meaning: "Golden-Tongued Bird",
    category: "animal", element: "air",
    description: "A single mythical bird with a golden tongue — the ultimate charm for persuasion, eloquence, and making every word you speak land with power. Where Sarika Koo is about mutual attraction, Salika Lin Thong is about the spoken word itself.",
    traits: ["charisma", "communication", "manifestation", "love", "ambition", "joy"],
    energy: "magnetic", placement: "Tongue (by monks), chest, or throat area", visibility: "visible", areas: ["chest", "neck_spine"], size: "small",
    collageNote: "Voice piece — traditionally paired with Metta Mahaniyom.",
    famous: "Requested by lawyers, salespeople, politicians, and public speakers.",
    svg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="50" r="28" stroke="currentColor" stroke-width="2"/><path d="M80 40 L60 15 L75 32" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M120 40 L140 15 L125 32" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="92" cy="48" r="2.5" fill="currentColor"/><circle cx="108" cy="48" r="2.5" fill="currentColor"/><g stroke="currentColor" stroke-width="1.4" opacity="0.7"><path d="M75 55 Q65 65 70 85"/><path d="M125 55 Q135 65 130 85"/></g><g stroke="currentColor" stroke-width="1.2" opacity="0.6"><path d="M70 50 L55 45 L65 60"/><path d="M130 50 L145 45 L135 60"/></g><ellipse cx="100" cy="145" rx="48" ry="65" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="1.5" opacity="0.8"><path d="M68 100 Q50 125 55 175 Q65 215 80 240"/><path d="M132 100 Q150 125 145 175 Q135 215 120 240"/></g><g stroke="currentColor" stroke-width="1.1" opacity="0.7"><path d="M60 75 L55 95"/><path d="M140 75 L145 95"/></g><path d="M98 70 L100 95 L102 70" stroke="currentColor" stroke-width="1.2" fill="none"/><polygon points="100,96 105,115 95,115" stroke="currentColor" stroke-width="1.3" fill="currentColor" opacity="0.3"/><g stroke="currentColor" stroke-width="0.8" opacity="0.5"><path d="M65 130 Q55 150 62 180"/><path d="M65 135 Q48 165 58 205"/><path d="M135 130 Q145 150 138 180"/><path d="M135 135 Q152 165 142 205"/></g></svg>`
  },
  phra_narai: {
    name: "Phra Narai", thai: "พระนารายณ์", meaning: "Vishnu / The Preserver",
    category: "deity", element: "water",
    description: "Vishnu in Thai form — the preserver of the universe, riding Garuda across the heavens. Four arms holding divine weapons and symbols of cosmic order. Bestows protection, justice, and the preservation of what is sacred.",
    traits: ["protection", "authority", "spirituality", "wisdom", "strength", "balance"],
    energy: "elevated", placement: "Full back or center back", visibility: "hidden", areas: ["center_back", "upper_back"], size: "large",
    collageNote: "Major deity piece — commands the center back as a crowning work.",
    famous: "Thai kings have historically been considered incarnations of Narai.",
    svg: `<svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="70" r="35" stroke="currentColor" stroke-width="2.2"/><path d="M75 55 L55 25 L72 45" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M125 55 L145 25 L128 45" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><g stroke="currentColor" stroke-width="1.5" opacity="0.7"><circle cx="100" cy="70" r="18" fill="none"/><path d="M80 60 L65 55 L75 70"/><path d="M120 60 L135 55 L125 70"/></g><ellipse cx="100" cy="170" rx="55" ry="80" stroke="currentColor" stroke-width="2.2"/><g stroke="currentColor" stroke-width="1.8" opacity="0.8"><path d="M58 100 Q35 135 42 190 Q55 250 72 290"/><path d="M142 100 Q165 135 158 190 Q145 250 128 290"/></g><g stroke="currentColor" stroke-width="1.4" opacity="0.7"><path d="M80 90 Q70 110 75 145"/><path d="M120 90 Q130 110 125 145"/></g><g stroke="currentColor" stroke-width="1.2" opacity="0.6"><path d="M65 75 L50 70 L60 85"/><path d="M135 75 L150 70 L140 85"/><path d="M70 140 L60 160"/><path d="M130 140 L140 160"/></g><g stroke="currentColor" stroke-width="0.8" opacity="0.4"><path d="M50 120 Q40 145 50 180"/><path d="M50 130 Q35 160 48 210"/><path d="M150 120 Q160 145 150 180"/><path d="M150 130 Q165 160 152 210"/></g><circle cx="100" cy="170" r="25" fill="currentColor" opacity="0.15"/></svg>`
  },
  nak_prok: {
    name: "Nak Prok", thai: "นาคปรก", meaning: "Naga-Sheltered Buddha",
    category: "deity", element: "water",
    description: "Buddha seated in meditation beneath the hood of a seven-headed Naga serpent — the moment when the Naga king Mucalinda sheltered Buddha from a storm during his enlightenment. Represents divine protection during your most vulnerable moments of growth.",
    traits: ["protection", "spirituality", "transformation", "wisdom", "rebirth", "depth"],
    energy: "transformative", placement: "Back or chest", visibility: "semi", areas: ["upper_back", "center_back", "chest"], size: "large",
    collageNote: "Sacred centerpiece — combines the power of Buddha and Naga in one image.",
    famous: "Saturday Buddha posture — one of the most sacred images in Thai Buddhism.",
    svg: `<svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="120" r="28" stroke="currentColor" stroke-width="2"/><ellipse cx="100" cy="180" rx="45" ry="60" stroke="currentColor" stroke-width="2"/><path d="M80 135 Q70 155 75 190" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M120 135 Q130 155 125 190" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="95" cy="115" r="2.5" fill="currentColor"/><circle cx="105" cy="115" r="2.5" fill="currentColor"/><path d="M100 45 Q105 35 105 20" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M100 45 Q95 35 95 20" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/><g stroke="currentColor" stroke-width="2" opacity="0.8"><path d="M75 35 Q65 25 60 12 Q62 24 65 38"/><path d="M85 28 Q78 15 75 5 Q77 18 80 32"/><path d="M95 22 Q90 8 88 0 Q90 12 93 25"/><path d="M115 28 Q122 15 125 5 Q123 18 120 32"/><path d="M125 35 Q135 25 140 12 Q138 24 135 38"/></g><g stroke="currentColor" stroke-width="1.5" opacity="0.6"><path d="M70 40 Q55 50 60 80"/><path d="M130 40 Q145 50 140 80"/></g><g stroke="currentColor" stroke-width="1" opacity="0.5"><path d="M65 50 Q50 65 58 95"/><path d="M65 60 Q45 80 55 120"/><path d="M135 50 Q150 65 142 95"/><path d="M135 60 Q155 80 145 120"/></g><circle cx="100" cy="180" r="20" fill="currentColor" opacity="0.15"/><path d="M90 200 L85 240" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M110 200 L115 240" stroke="currentColor" stroke-width="1.5" fill="none"/><g stroke="currentColor" stroke-width="0.8" opacity="0.4"><path d="M100 80 Q95 100 100 120"/><path d="M100 80 Q105 100 100 120"/></g></svg>`
  },
};

const QUESTIONS = [
  {
    id: "path", element: null, type: "single",
    question: "How do you want to walk this path?",
    sub: "This shapes the guidance you'll receive.",
    options: [
      { label: "I seek a design that follows the ancestral lineage — traditional placement, traditional meaning", value: "traditional", traits: ["tradition", "spirituality", "foundation", "wisdom"] },
      { label: "I seek a design that serves as a personal symbolic anchor — meaning matters, but on my terms", value: "personal", traits: ["independence", "adaptability", "freedom"] },
      { label: "I'm still learning — guide me and I'll listen", value: "learning", traits: ["curiosity", "wisdom", "balance"] },
    ]
  },
  {
    id: "earth", element: "earth", type: "single",
    question: "What is the ground beneath your feet?",
    sub: "Earth asks: what do you stand on?",
    options: [
      { label: "My people — the ones I'd do anything for", value: "earth_people", element: "earth", traits: ["loyalty", "community", "devotion", "foundation"] },
      { label: "My own two hands — what I've built and what I've survived", value: "earth_self", element: "earth", traits: ["resilience", "independence", "strength", "discipline"] },
      { label: "Something ancient — tradition, lineage, roots that go deeper than me", value: "earth_roots", element: "earth", traits: ["tradition", "wisdom", "foundation", "spirituality"] },
      { label: "Honestly? I'm still building it", value: "earth_building", element: "earth", traits: ["transformation", "adaptability", "courage", "rebirth"] },
    ]
  },
  {
    id: "water", element: "water", type: "single",
    question: "What runs beneath your surface?",
    sub: "Water asks: what do you carry that others don't see?",
    options: [
      { label: "A deep intuition — I feel things before they happen", value: "water_intuition", element: "water", traits: ["intuition", "mystery", "depth", "wisdom"] },
      { label: "Old pain I'm learning to release", value: "water_release", element: "water", traits: ["transformation", "rebirth", "resilience", "adaptability"] },
      { label: "A quiet love that runs deeper than I show", value: "water_love", element: "water", traits: ["devotion", "loyalty", "love", "community"] },
      { label: "Restlessness — a current pulling me somewhere new", value: "water_restless", element: "water", traits: ["travel", "freedom", "wandering", "curiosity"] },
    ]
  },
  {
    id: "fire", element: "fire", type: "single",
    question: "What would you walk through fire for?",
    sub: "Fire asks: what makes you dangerous — in the best way?",
    options: [
      { label: "The people I love — without hesitation", value: "fire_protect", element: "fire", traits: ["loyalty", "devotion", "strength", "warrior"] },
      { label: "My own freedom — I refuse to be caged", value: "fire_freedom", element: "fire", traits: ["freedom", "independence", "courage", "authority"] },
      { label: "Something I haven't built yet — a vision only I can see", value: "fire_vision", element: "fire", traits: ["ambition", "leadership", "manifestation", "creativity"] },
      { label: "What's right — I fight for justice even when it costs me", value: "fire_justice", element: "fire", traits: ["courage", "warrior", "protection", "discipline"] },
    ]
  },
  {
    id: "air", element: "air", type: "single",
    question: "Close your eyes. What do you see?",
    sub: "Air asks: what are you reaching toward?",
    options: [
      { label: "Stillness — peace after everything I've been through", value: "air_peace", element: "air", traits: ["balance", "spirituality", "wisdom", "tradition"] },
      { label: "Abundance — I want life to overflow with good things", value: "air_abundance", element: "air", traits: ["abundance", "luck", "manifestation", "joy", "optimism"] },
      { label: "Connection — being truly seen and deeply known", value: "air_connection", element: "air", traits: ["charisma", "love", "community", "communication"] },
      { label: "The unknown — somewhere I haven't been yet", value: "air_unknown", element: "air", traits: ["travel", "freedom", "curiosity", "adaptability"] },
    ]
  },
  {
    id: "offerings", element: null, type: "multi",
    question: "Place your offerings on the table.",
    sub: "Choose 2 or 3 intentions you want your yant to carry.",
    maxSelect: 3,
    minSelect: 2,
    options: null,
  },
  {
    id: "balance", element: null, type: "single",
    question: "Which element do you need more of?",
    sub: "Not what you are — what's missing. The yant fills the gap.",
    options: [
      { label: "Earth — I need grounding, roots, something solid beneath me", value: "need_earth", element: "earth", traits: ["foundation", "protection", "balance", "tradition", "discipline"] },
      { label: "Water — I need to feel again, to release, to transform", value: "need_water", element: "water", traits: ["transformation", "intuition", "depth", "rebirth", "adaptability"] },
      { label: "Fire — I need courage, power, the will to finally act", value: "need_fire", element: "fire", traits: ["strength", "courage", "warrior", "authority", "ambition"] },
      { label: "Air — I need lightness, vision, room to breathe", value: "need_air", element: "air", traits: ["freedom", "joy", "abundance", "spirituality", "curiosity"] },
    ]
  },
  {
    id: "placement", element: null, type: "areas",
    question: "Where on your body do you feel this belongs?",
    sub: "Tap the areas you're open to. You can select multiple.",
    options: null,
  },
  {
    id: "discretion", element: null, type: "single",
    question: "Does this need to stay between you and the ink?",
    sub: "No judgment — practical needs shape the right choice.",
    options: [
      { label: "Yes — it should be easy to conceal", value: "hidden", traits: [] },
      { label: "I don't mind it showing sometimes", value: "semi", traits: [] },
      { label: "I want it visible — this is part of who I am", value: "visible", traits: [] },
    ]
  },
  {
    id: "collage", element: null, type: "single",
    question: "One yant, or many?",
    sub: "Many people build a sacred body map over years.",
    options: [
      { label: "One perfect yant — singular and meaningful", value: "one", traits: ["tradition", "completeness"] },
      { label: "A foundation piece to start my collection", value: "start", traits: ["foundation", "balance"] },
      { label: "I want a full collage — I'm thinking big", value: "collage", traits: ["completeness", "ambition", "wisdom"] },
      { label: "Not sure yet — show me what resonates", value: "open", traits: [] },
    ]
  },
];

function scoreYants(answers, selectedAreas, discretion) {
  const traitScores = {};
  const elementScores = { earth: 0, water: 0, fire: 0, air: 0 };

  answers.forEach(a => {
    (a.traits || []).forEach(t => { traitScores[t] = (traitScores[t] || 0) + 1; });
    if (a.element) elementScores[a.element] += 1;
    if (a.value && a.value.startsWith("need_")) {
      const el = a.value.replace("need_", "");
      if (elementScores[el] !== undefined) elementScores[el] += 1.5;
    }
  });

  const scored = Object.entries(YANTS).map(([key, yant]) => {
    let intentScore = yant.traits.reduce((s, t) => s + (traitScores[t] || 0), 0);

    let elemScore = yant.element && elementScores[yant.element] ? elementScores[yant.element] * 0.8 : 0;

    let placementScore = 0;
    if (selectedAreas && selectedAreas.length > 0) {
      const overlap = yant.areas ? yant.areas.filter(a => selectedAreas.includes(a)).length : 0;
      placementScore = overlap > 0 ? (overlap / Math.max(yant.areas.length, 1)) * 6 : -2;
    }

    let discretionScore = 0;
    if (discretion) {
      if (discretion === yant.visibility) discretionScore = 3;
      else if (
        (discretion === "hidden" && yant.visibility === "semi") ||
        (discretion === "semi" && yant.visibility !== "visible") ||
        (discretion === "visible")
      ) discretionScore = 1;
      else discretionScore = -2;
    }

    const score = intentScore + elemScore + placementScore + discretionScore;
    return { key, yant, score };
  });
  return scored.sort((a, b) => b.score - a.score);
}

function getElementProfile(answers) {
  const profile = { earth: 0, water: 0, fire: 0, air: 0 };
  answers.forEach(a => {
    if (a.element) profile[a.element] += 1;
    if (a.value && a.value.startsWith("need_")) {
      const el = a.value.replace("need_", "");
      if (profile[el] !== undefined) profile[el] += 0.5;
    }
  });
  const max = Math.max(...Object.values(profile), 1);
  Object.keys(profile).forEach(k => { profile[k] = profile[k] / max; });
  return profile;
}

const G = "#C9A84C", DARK = "#0D0B07", DEEP = "#121008", WARM = "#F0E8D0", DIM = "#7A6D52", MID = "#9A8D6E", SUB = "#221E14";
const CATS = ["all","geometric","animal","deity","nature"];
const CAT_L = { all:"All Designs", geometric:"Geometric", animal:"Animal Spirits", deity:"Deities", nature:"Nature" };

function Btn({ children, primary, small, onClick, disabled }) {
  const [h, setH] = useState(false);
  return (
    <button disabled={disabled} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: disabled ? "transparent" : primary ? (h ? "#E0BB5E" : G) : (h ? "rgba(201,168,76,0.06)" : "transparent"),
        border: `1px solid ${disabled ? SUB : primary ? G : h ? "#6A5A3A" : "#3A3020"}`,
        color: disabled ? DIM : primary ? DARK : h ? WARM : DIM,
        padding: small ? "8px 18px" : "13px 36px",
        fontSize: small ? 10 : 11, letterSpacing: small ? 2 : 3,
        textTransform: "uppercase", cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "Georgia, serif", fontWeight: primary ? "bold" : "normal",
        transition: "all 0.2s ease", whiteSpace: "nowrap",
      }}>{children}</button>
  );
}

function YantCard({ yantKey, yant, selected, onSelect, onToggle, rank }) {
  const [h, setH] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      {rank && rank <= 5 && (
        <div style={{ position:"absolute", top:-1, left:-1, right:-1, height:2, background: rank===1?"#C9A84C": rank<=3?"rgba(201,168,76,0.6)":"rgba(201,168,76,0.3)", zIndex:1 }}/>
      )}
      <div onClick={onSelect}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{
          border: `1px solid ${selected ? G : h ? "#5A5040" : SUB}`,
          background: selected ? "rgba(201,168,76,0.07)" : h ? "rgba(255,255,255,0.015)" : "transparent",
          cursor: "pointer", padding: "18px 14px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 9,
          transition: "all 0.18s ease", position:"relative",
        }}>
        {rank && <div style={{ position:"absolute", top:7, left:9, fontSize:9, letterSpacing:2, color:G, opacity:0.7 }}>#{rank}</div>}
        {selected && <div style={{ position:"absolute", top:7, right:9, fontSize:12, color:G }}>✓</div>}
        {/* Hover tooltip with meaning */}
        {h && (
          <div style={{
            position:"absolute", bottom:"100%", left:"50%", transform:"translateX(-50%)",
            background:DEEP, border:`1px solid ${G}`, padding:"10px 14px",
            zIndex:50, width:200, pointerEvents:"none", marginBottom:6,
            boxShadow:"0 4px 20px rgba(0,0,0,0.5)",
          }}>
            <div style={{ fontSize:10, color:G, letterSpacing:1, marginBottom:4 }}>{yant.meaning}</div>
            <div style={{ fontSize:9, color:DIM, lineHeight:1.5 }}>{yant.description.slice(0,120)}...</div>
            <div style={{ position:"absolute", bottom:-5, left:"50%", transform:"translateX(-50%) rotate(45deg)", width:8, height:8, background:DEEP, borderRight:`1px solid ${G}`, borderBottom:`1px solid ${G}` }} />
          </div>
        )}
        <div style={{ width:80, height:80, color: selected ? G : h ? MID : DIM, transition:"color 0.18s ease" }}
          dangerouslySetInnerHTML={{ __html: yant.svg }} />
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:12, color: selected?G:WARM, letterSpacing:0.5, marginBottom:2 }}>{yant.name}</div>
          <div style={{ fontSize:10, color:DIM, letterSpacing:1 }}>{yant.thai}</div>
        </div>
        <div style={{ fontSize:9, color:DIM, textAlign:"center", letterSpacing:0.3, lineHeight:1.4 }}>{yant.meaning}</div>
        {yant.element && ELEMENTS[yant.element] && (
          <div style={{ fontSize:8, letterSpacing:2, color:ELEMENTS[yant.element].color, textTransform:"uppercase" }}>
            {ELEMENTS[yant.element].symbol} {ELEMENTS[yant.element].name}
          </div>
        )}
      </div>
      <button onClick={(e) => { e.stopPropagation(); onToggle(yantKey); }}
        style={{
          width:"100%", border:`1px solid ${selected ? G : SUB}`, borderTop:"none",
          background: selected ? "rgba(201,168,76,0.1)" : "transparent",
          color: selected ? G : DIM, fontSize:9, letterSpacing:2, textTransform:"uppercase",
          padding:"6px 0", cursor:"pointer", fontFamily:"Georgia,serif", transition:"all 0.18s ease",
        }}
        onMouseEnter={e=>{ if(!selected){e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.color=MID;}}}
        onMouseLeave={e=>{ if(!selected){e.currentTarget.style.background="transparent"; e.currentTarget.style.color=DIM;}}}
      >
        {selected ? "✓ In Collection" : "+ Add"}
      </button>
    </div>
  );
}

function Modal({ yantKey, yant, inCollage, onToggle, onClose, currentStatus, onSetStatus }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(8,6,3,0.94)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:DEEP, border:`1px solid ${SUB}`, maxWidth:560, width:"100%",
        maxHeight:"88vh", overflowY:"auto", padding:"36px 32px", position:"relative",
      }}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:16, background:"none", border:"none", color:DIM, fontSize:18, cursor:"pointer" }}>✕</button>
        <div style={{ color:G, fontSize:26, marginBottom:4, letterSpacing:3 }}>{yant.thai}</div>
        <h2 style={{ fontSize:22, fontWeight:"normal", color:WARM, margin:"0 0 4px", fontStyle:"italic" }}>{yant.name}</h2>
        <div style={{ fontSize:10, color:DIM, letterSpacing:3, textTransform:"uppercase", marginBottom:20 }}>{yant.meaning}</div>
        <div style={{ background:"rgba(201,168,76,0.03)", border:`1px solid rgba(201,168,76,0.08)`, padding:"28px 20px", marginBottom:20 }}>
          <div style={{ width:"100%", maxWidth:280, height:280, color:G, margin:"0 auto" }} dangerouslySetInnerHTML={{ __html: yant.svg }} />
        </div>
        <p style={{ fontSize:14, lineHeight:1.85, color:MID, marginBottom:20 }}>{yant.description}</p>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {yant.element && ELEMENTS[yant.element] && (
            <span style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", border:`1px solid ${ELEMENTS[yant.element].color}`, color:ELEMENTS[yant.element].color, padding:"3px 8px" }}>{ELEMENTS[yant.element].symbol} {ELEMENTS[yant.element].name}</span>
          )}
          {yant.traits.map(t=>(
            <span key={t} style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", border:`1px solid rgba(201,168,76,0.22)`, color:G, padding:"3px 8px" }}>{t}</span>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[["Placement", yant.placement], ["Energy", yant.energy], ["Visibility", yant.visibility === "hidden" ? "Easy to conceal" : yant.visibility === "semi" ? "Semi-hidden" : "Visible"], ["Size", yant.size ? yant.size.charAt(0).toUpperCase() + yant.size.slice(1) + " design" : ""]].filter(([,v])=>v).map(([l,v])=>(
            <div key={l} style={{ border:`1px solid ${SUB}`, padding:"12px 14px" }}>
              <div style={{ fontSize:9, letterSpacing:3, color:DIM, textTransform:"uppercase", marginBottom:5 }}>{l}</div>
              <div style={{ fontSize:12, color:WARM, textTransform:"capitalize" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(201,168,76,0.04)", border:`1px solid rgba(201,168,76,0.1)`, padding:"14px 16px", marginBottom:16 }}>
          <div style={{ fontSize:9, letterSpacing:3, color:G, textTransform:"uppercase", marginBottom:6 }}>✦ Collage Note</div>
          <p style={{ fontSize:12, color:DIM, margin:0, lineHeight:1.6 }}>{yant.collageNote}</p>
        </div>
        {yant.famous && <p style={{ fontSize:11, color:DIM, fontStyle:"italic", marginBottom:20, lineHeight:1.6 }}>{yant.famous}</p>}

        <a href={`https://www.google.com/search?q=${encodeURIComponent(`"${yant.name}" OR "${yant.thai}" sak yant tattoo`)}&tbm=isch`} target="_blank" rel="noopener noreferrer" style={{
          display:"block", width:"100%", background:"transparent", border:`1px solid ${SUB}`,
          color:DIM, padding:"12px", fontSize:10, letterSpacing:3,
          textTransform:"uppercase", cursor:"pointer", fontFamily:"Georgia,serif",
          textAlign:"center", textDecoration:"none", marginBottom:12,
          transition:"all 0.18s ease",
        }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=G; e.currentTarget.style.color=G; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=SUB; e.currentTarget.style.color=DIM; }}
        >See Real Tattoo Photos →</a>

        {/* Journey Status */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:9, letterSpacing:3, color:DIM, textTransform:"uppercase", marginBottom:8 }}>Mark Your Journey</div>
          <div style={{ display:"flex", gap:8 }}>
            {[["have","✓ I Have This", "#4A7A5A"],["next","Getting Next", G],["someday","Someday", "#5B7B8A"]].map(([s, label, color]) => (
              <button key={s} onClick={()=>{ onSetStatus(yantKey, s); }} style={{
                flex:1, background: currentStatus===s ? (color+"22") : "transparent",
                border:`1px solid ${currentStatus===s ? color : SUB}`,
                color: currentStatus===s ? color : DIM,
                padding:"8px", fontSize:9, letterSpacing:2, textTransform:"uppercase",
                cursor:"pointer", fontFamily:"Georgia,serif",
              }}>{label}</button>
            ))}
          </div>
        </div>

        <button onClick={()=>{onToggle(yantKey); onClose();}} style={{
          width:"100%", background: inCollage?"transparent":G, border:`1px solid ${G}`,
          color: inCollage?G:DARK, padding:"13px", fontSize:11, letterSpacing:3,
          textTransform:"uppercase", cursor:"pointer", fontFamily:"Georgia,serif",
        }}>{inCollage ? "Remove from Collection" : "Add to Collection"}</button>
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ranked, setRanked] = useState([]);
  const [collage, setCollage] = useState(new Set());
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [fading, setFading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("recommended");
  const [elementProfile, setElementProfile] = useState(null);
  const [offerings, setOfferings] = useState(new Set());
  const [bodyAreas, setBodyAreas] = useState([]);
  const [discretion, setDiscretion] = useState(null);
  const [pathChoice, setPathChoice] = useState(null);
  const [journey, setJourney] = useState({}); // { yantKey: "have" | "next" | "someday" }
  const [journeyNotes, setJourneyNotes] = useState({}); // { yantKey: "note text" }
  const [journeyFilter, setJourneyFilter] = useState("all"); // "all" | "have" | "next" | "someday"
  const [editingNote, setEditingNote] = useState(null); // yantKey being edited

  useEffect(() => { setTimeout(()=>setLoaded(true),80); },[]);

  // Load persisted state
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.collage) setCollage(new Set(saved.collage));
      if (saved.journey) setJourney(saved.journey);
      if (saved.journeyNotes) setJourneyNotes(saved.journeyNotes);
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    saveState({
      collage: [...collage],
      journey: journey,
      journeyNotes: journeyNotes,
    });
  }, [collage, journey, journeyNotes]);

  const toggleCollage = key => setCollage(prev => { const n=new Set(prev); n.has(key)?n.delete(key):n.add(key); return n; });

  const setYantStatus = (key, status) => {
    setJourney(prev => {
      const n = {...prev};
      if (n[key] === status) { delete n[key]; } else { n[key] = status; }
      return n;
    });
    // Also add to collage if marking as "have" or "next"
    if (status === "have" || status === "next") {
      setCollage(prev => { const n = new Set(prev); n.add(key); return n; });
    }
  };

  const updateNote = (key, note) => {
    setJourneyNotes(prev => ({...prev, [key]: note}));
  };

  const handleNext = () => {
    const q = QUESTIONS[currentQ];
    if (q.type === "multi" ? offerings.size < (q.minSelect || 1) : q.type === "areas" ? bodyAreas.length === 0 : (q.type === "single" || !q.type) && !selected) return;

    let na = [...answers];
    let currentDiscretion = discretion;

    if (q.type === "single" || !q.type) {
      na.push(selected);
      if (q.id === "path") setPathChoice(selected.value);
      if (q.id === "discretion") { currentDiscretion = selected.value; setDiscretion(selected.value); }
    } else if (q.type === "multi") {
      OFFERINGS.filter(o => offerings.has(o.id)).forEach(o => {
        na.push({ value: o.id, traits: o.traits });
      });
    } else if (q.type === "areas") {
      na.push({ value: "areas", traits: [] });
    }

    if (currentQ < QUESTIONS.length - 1) {
      setFading(true);
      setTimeout(() => { setAnswers(na); setCurrentQ(currentQ + 1); setSelected(null); setFading(false); }, 320);
    } else {
      const scored = scoreYants(na, bodyAreas, currentDiscretion);
      setRanked(scored);
      setCollage(new Set(scored.slice(0, 3).map(r => r.key)));
      setElementProfile(getElementProfile(na));
      setAnswers(na);
      setPhase("reading");
    }
  };

  const reset = () => { setPhase("intro"); setCurrentQ(0); setAnswers([]); setSelected(null); setRanked([]); setCollage(new Set()); setFilter("all"); setDetail(null); setTab("recommended"); setElementProfile(null); setOfferings(new Set()); setBodyAreas([]); setDiscretion(null); setPathChoice(null); setJourneyFilter("all"); setEditingNote(null); };

  const yantEntries = Object.entries(YANTS);
  const filtered = filter==="all" ? yantEntries : yantEntries.filter(([,y])=>y.category===filter);
  const rankMap = {}; ranked.forEach((r,i)=>{ rankMap[r.key]=i+1; });

  const displayList = (ranked.length>0 && tab==="recommended") ? ranked.map(r=>[r.key,r.yant]) : filtered;

  return (
    <div style={{ minHeight:"100vh", background:DARK, fontFamily:"Georgia,'Times New Roman',serif", color:WARM, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:`radial-gradient(ellipse at 15% 15%, rgba(201,168,76,0.05) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(201,168,76,0.04) 0%, transparent 55%), repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(201,168,76,0.01) 50px,rgba(201,168,76,0.01) 51px), repeating-linear-gradient(90deg,transparent,transparent 50px,rgba(201,168,76,0.01) 50px,rgba(201,168,76,0.01) 51px)` }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:920, margin:"0 auto", padding:"0 20px", opacity:loaded?1:0, transition:"opacity 0.8s ease" }}>

        {/* INTRO */}
        {phase==="intro" && (
          <div style={{ textAlign:"center", paddingTop:80, paddingBottom:60 }}>
            <div style={{ fontSize:10, letterSpacing:7, color:G, marginBottom:32, textTransform:"uppercase" }}>Sacred Geometry · Ancient Blessing</div>
            <div style={{ fontSize:"clamp(36px, 10vw, 62px)", color:G, marginBottom:10, lineHeight:1, fontStyle:"italic", textShadow:`0 0 60px rgba(201,168,76,0.22)` }}>สักยันต์</div>
            <h1 style={{ fontSize:24, fontWeight:"normal", letterSpacing:"clamp(2px, 0.5vw, 4px)", color:WARM, marginBottom:6, textTransform:"uppercase" }}>Sak Yant Oracle</h1>
            <div style={{ fontSize:10, color:DIM, letterSpacing:4, marginBottom:44, textTransform:"uppercase" }}>Tattoo Guidance & Design Library</div>
            <div style={{ width:60, height:1, background:`linear-gradient(90deg,transparent,${G},transparent)`, margin:"0 auto 40px" }} />
            <p style={{ fontSize:15, lineHeight:1.85, color:MID, maxWidth:500, margin:"0 auto 16px" }}>Sak yants are sacred geometric tattoos from Thailand, Cambodia, and Laos — blessed by monks and ajarn masters, carrying real spiritual weight.</p>
            <p style={{ fontSize:13, lineHeight:1.8, color:DIM, maxWidth:440, margin:"0 auto 48px" }}>Walk through the four elements, offer your intentions, and receive a personalised yant manifestation. The journey takes about two minutes.</p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <Btn primary onClick={()=>setPhase("quiz")}>Begin the Reading</Btn>
              <Btn onClick={()=>{ setRanked([]); setTab("all"); setPhase("library"); }}>Browse All {yantEntries.length} Designs</Btn>
            </div>
            {Object.keys(journey).length > 0 && (
              <div style={{ marginTop:14 }}>
                <Btn small onClick={()=>setPhase("journey")}>Continue My Journey ({Object.keys(journey).length} yants)</Btn>
              </div>
            )}
            <div style={{ marginTop:56, fontSize:10, color:"#3A3020", letterSpacing:3 }}>✦ &nbsp; APPROACH WITH RESPECT &nbsp; ✦</div>
            <div style={{ marginTop:16, fontSize:10, color:"#2A2318", letterSpacing:1, lineHeight:1.8, maxWidth:440, margin:"16px auto 0" }}>
              Meanings vary by lineage, ajarn, and temple. This app guides — it does not declare. Final design and placement should always be confirmed with a qualified practitioner.
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase==="quiz" && (
          <div style={{ paddingTop:60, paddingBottom:60, maxWidth:620, margin:"0 auto", opacity:fading?0:1, transform:fading?"translateY(8px)":"translateY(0)", transition:"opacity 0.32s ease, transform 0.32s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:44 }}>
              <div style={{ fontSize:10, letterSpacing:3, color:DIM, textTransform:"uppercase" }}>{currentQ+1} / {QUESTIONS.length}</div>
              <div style={{ display:"flex", gap:6 }}>
                {QUESTIONS.map((_,i)=>(
                  <div key={i} style={{ width:i<=currentQ?24:8, height:2, background:i<=currentQ?G:"#2A2318", transition:"all 0.4s ease", borderRadius:1 }} />
                ))}
              </div>
            </div>
            {QUESTIONS[currentQ].element && (
              <div style={{ marginBottom:20 }}>
                <span style={{ fontSize:22, color:ELEMENTS[QUESTIONS[currentQ].element].color, marginRight:8 }}>
                  {ELEMENTS[QUESTIONS[currentQ].element].symbol}
                </span>
                <span style={{ fontSize:10, letterSpacing:4, color:ELEMENTS[QUESTIONS[currentQ].element].color, textTransform:"uppercase" }}>
                  {ELEMENTS[QUESTIONS[currentQ].element].name} · {ELEMENTS[QUESTIONS[currentQ].element].thai}
                </span>
              </div>
            )}
            <h2 style={{ fontSize:23, fontWeight:"normal", lineHeight:1.4, color:WARM, marginBottom:8, fontStyle:"italic" }}>{QUESTIONS[currentQ].question}</h2>
            <p style={{ fontSize:12, color:DIM, marginBottom:10 }}>{QUESTIONS[currentQ].sub}</p>
            <div style={{ width:36, height:1, background:G, marginBottom:32, opacity:0.5 }} />

            {/* Options based on question type */}
            {(QUESTIONS[currentQ].type === "single" || !QUESTIONS[currentQ].type) && QUESTIONS[currentQ].options && (
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:40 }}>
                {QUESTIONS[currentQ].options.map((opt,i)=>{
                  const isSel = selected?.value===opt.value;
                  return (
                    <button key={i} onClick={()=>setSelected(opt)} style={{
                      background:isSel?"rgba(201,168,76,0.07)":"transparent",
                      border:`1px solid ${isSel?G:SUB}`, color:isSel?G:MID,
                      padding:"15px 18px", textAlign:"left", fontSize:14, lineHeight:1.5,
                      cursor:"pointer", fontFamily:"Georgia,serif",
                      display:"flex", alignItems:"center", gap:13, transition:"all 0.18s ease",
                    }}
                      onMouseEnter={e=>{ if(!isSel){ e.currentTarget.style.borderColor="#5A5040"; e.currentTarget.style.color=WARM; }}}
                      onMouseLeave={e=>{ if(!isSel){ e.currentTarget.style.borderColor=SUB; e.currentTarget.style.color=MID; }}}
                    >
                      <span style={{ width:17, height:17, borderRadius:"50%", border:`1px solid ${isSel?G:"#5A5040"}`, background:isSel?G:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:DARK }}>{isSel?"✓":""}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Offering Table — multi-select */}
            {QUESTIONS[currentQ].type === "multi" && (
              <div style={{ marginBottom:40 }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(100px, 1fr))", gap:10 }}>
                  {OFFERINGS.map(o => {
                    const isSel = offerings.has(o.id);
                    const atMax = offerings.size >= (QUESTIONS[currentQ].maxSelect || 3) && !isSel;
                    return (
                      <button key={o.id}
                        onClick={() => {
                          if (atMax) return;
                          setOfferings(prev => { const n = new Set(prev); n.has(o.id) ? n.delete(o.id) : n.add(o.id); return n; });
                        }}
                        style={{
                          background: isSel ? "rgba(201,168,76,0.1)" : "transparent",
                          border: `1px solid ${isSel ? G : atMax ? "#1A1810" : SUB}`,
                          color: isSel ? G : atMax ? "#3A3020" : DIM,
                          padding: "20px 12px", cursor: atMax ? "default" : "pointer",
                          fontFamily: "Georgia,serif", transition: "all 0.22s ease",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                          opacity: atMax ? 0.4 : 1,
                        }}
                        onMouseEnter={e => { if (!isSel && !atMax) { e.currentTarget.style.borderColor = "#5A5040"; e.currentTarget.style.color = WARM; }}}
                        onMouseLeave={e => { if (!isSel && !atMax) { e.currentTarget.style.borderColor = SUB; e.currentTarget.style.color = DIM; }}}
                      >
                        <div style={{ fontSize: 24, opacity: isSel ? 1 : 0.5, transition: "opacity 0.2s ease" }}>{o.icon}</div>
                        <div style={{ fontSize: 11, letterSpacing: 1 }}>{o.label}</div>
                        <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.5 }}>{o.thai}</div>
                      </button>
                    );
                  })}
                </div>
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 10, color: DIM, letterSpacing: 1 }}>
                  {offerings.size} of {QUESTIONS[currentQ].maxSelect || 3} selected
                  {offerings.size < (QUESTIONS[currentQ].minSelect || 2) && <span style={{ color: "#6A5A3A" }}> · select at least {QUESTIONS[currentQ].minSelect || 2}</span>}
                </div>
              </div>
            )}

            {/* Body Area selector */}
            {QUESTIONS[currentQ].type === "areas" && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
                  {BODY_AREAS.map(area => {
                    const isSel = bodyAreas.includes(area.id);
                    return (
                      <button key={area.id}
                        onClick={() => {
                          setBodyAreas(prev => prev.includes(area.id) ? prev.filter(a => a !== area.id) : [...prev, area.id]);
                        }}
                        style={{
                          background: isSel ? "rgba(201,168,76,0.1)" : "transparent",
                          border: `1px solid ${isSel ? G : SUB}`,
                          color: isSel ? G : DIM,
                          padding: "14px 10px", cursor: "pointer",
                          fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: 1,
                          transition: "all 0.18s ease",
                        }}
                        onMouseEnter={e => { if (!isSel) { e.currentTarget.style.borderColor = "#5A5040"; e.currentTarget.style.color = WARM; }}}
                        onMouseLeave={e => { if (!isSel) { e.currentTarget.style.borderColor = SUB; e.currentTarget.style.color = DIM; }}}
                      >
                        {isSel && <span style={{ marginRight: 6 }}>✓</span>}
                        {area.label}
                      </button>
                    );
                  })}
                </div>
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 10, color: DIM, letterSpacing: 1 }}>
                  {bodyAreas.length} area{bodyAreas.length !== 1 ? "s" : ""} selected
                </div>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <button onClick={()=>{ if(currentQ===0){setPhase("intro");} else { setFading(true); setTimeout(()=>{ setCurrentQ(currentQ-1); setSelected(null); setFading(false); },280); }}} style={{ background:"none", border:"none", color:DIM, cursor:"pointer", fontSize:11, letterSpacing:2, fontFamily:"Georgia,serif" }}>← Back</button>
              <Btn primary onClick={handleNext} disabled={
                QUESTIONS[currentQ].type === "multi" ? offerings.size < (QUESTIONS[currentQ].minSelect || 2) :
                QUESTIONS[currentQ].type === "areas" ? bodyAreas.length === 0 :
                !selected
              }>
                {currentQ===QUESTIONS.length-1 ? "Reveal My Yants" : "Continue →"}
              </Btn>
            </div>
          </div>
        )}

        {/* READING */}
        {phase==="reading" && elementProfile && (
          <div style={{ textAlign:"center", paddingTop:70, paddingBottom:60, maxWidth:560, margin:"0 auto" }}>
            <div style={{ fontSize:10, letterSpacing:6, color:G, marginBottom:28, textTransform:"uppercase" }}>Your Manifestation</div>

            {/* Element diamond visualization */}
            <div style={{ position:"relative", width:220, height:220, margin:"0 auto 40px" }}>
              {/* Air - top */}
              <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
                <div style={{ fontSize:24, color:ELEMENTS.air.color, opacity:0.3 + elementProfile.air * 0.7, transition:"opacity 0.6s ease" }}>{ELEMENTS.air.symbol}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:elementProfile.air > 0.6 ? WARM : DIM, marginTop:2 }}>{ELEMENTS.air.thai}</div>
              </div>
              {/* Fire - right */}
              <div style={{ position:"absolute", top:"50%", right:0, transform:"translateY(-50%)", textAlign:"center" }}>
                <div style={{ fontSize:24, color:ELEMENTS.fire.color, opacity:0.3 + elementProfile.fire * 0.7, transition:"opacity 0.6s ease" }}>{ELEMENTS.fire.symbol}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:elementProfile.fire > 0.6 ? WARM : DIM, marginTop:2 }}>{ELEMENTS.fire.thai}</div>
              </div>
              {/* Earth - bottom */}
              <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
                <div style={{ fontSize:24, color:ELEMENTS.earth.color, opacity:0.3 + elementProfile.earth * 0.7, transition:"opacity 0.6s ease" }}>{ELEMENTS.earth.symbol}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:elementProfile.earth > 0.6 ? WARM : DIM, marginTop:2 }}>{ELEMENTS.earth.thai}</div>
              </div>
              {/* Water - left */}
              <div style={{ position:"absolute", top:"50%", left:0, transform:"translateY(-50%)", textAlign:"center" }}>
                <div style={{ fontSize:24, color:ELEMENTS.water.color, opacity:0.3 + elementProfile.water * 0.7, transition:"opacity 0.6s ease" }}>{ELEMENTS.water.symbol}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:elementProfile.water > 0.6 ? WARM : DIM, marginTop:2 }}>{ELEMENTS.water.thai}</div>
              </div>
              {/* Connecting lines */}
              <svg viewBox="0 0 220 220" style={{ position:"absolute", inset:0 }}>
                <polygon points="110,30 190,110 110,190 30,110" fill="none" stroke={G} strokeWidth="0.5" opacity="0.2" />
                <polygon
                  points={`110,${30 + (1-elementProfile.air)*80} ${190 - (1-elementProfile.fire)*80},110 110,${190 - (1-elementProfile.earth)*80} ${30 + (1-elementProfile.water)*80},110`}
                  fill={`rgba(201,168,76,0.08)`} stroke={G} strokeWidth="1" opacity="0.6"
                />
              </svg>
            </div>

            {/* Elemental bars */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:340, margin:"0 auto 36px" }}>
              {Object.entries(ELEMENTS).map(([key, el]) => (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ fontSize:10, letterSpacing:2, color:el.color, width:52, textAlign:"right" }}>{el.name}</div>
                  <div style={{ flex:1, height:3, background:SUB, position:"relative" }}>
                    <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${(elementProfile[key]||0)*100}%`, background:el.color, transition:"width 0.8s ease" }} />
                  </div>
                  <div style={{ fontSize:10, color:DIM, width:20 }}>{Math.round((elementProfile[key]||0)*100)}%</div>
                </div>
              ))}
            </div>

            {/* Reading text */}
            {(() => {
              const sorted = Object.entries(elementProfile).sort((a,b) => b[1] - a[1]);
              const primary = sorted[0][0];
              const secondary = sorted[1][0];
              const readings = {
                earth: "You are rooted — grounded in what matters, steady when the world shakes.",
                water: "You run deep — feeling, transforming, carrying currents others can't see.",
                fire: "You burn — courage, drive, a flame that refuses to go out.",
                air: "You reach — always looking upward, outward, toward what could be.",
              };
              const combos = {
                earth_water: "Rooted but flowing. You hold fast to what matters while letting go of what doesn't serve you.",
                earth_fire: "Solid and fierce. You protect with the strength of mountains and the heat of conviction.",
                earth_air: "Grounded yet expansive. Your roots go deep but your vision reaches far.",
                water_fire: "Depth meets drive. You feel everything and channel it into unstoppable forward motion.",
                water_air: "Intuitive and free. You sense what others miss and follow currents no one else can feel.",
                fire_air: "Burning bright and reaching high. Pure ambition tempered by vision and openness.",
              };
              const comboKey = [primary, secondary].sort().join("_");
              return (
                <div style={{ marginBottom:40 }}>
                  <p style={{ fontSize:15, lineHeight:1.85, color:MID, marginBottom:12 }}>
                    Your primary element is <span style={{ color:ELEMENTS[primary].color, fontStyle:"italic" }}>{ELEMENTS[primary].name} ({ELEMENTS[primary].thai})</span> with strong <span style={{ color:ELEMENTS[secondary].color, fontStyle:"italic" }}>{ELEMENTS[secondary].name} ({ELEMENTS[secondary].thai})</span> influence.
                  </p>
                  <p style={{ fontSize:13, lineHeight:1.8, color:DIM, fontStyle:"italic" }}>
                    {combos[comboKey] || readings[primary]}
                  </p>
                </div>
              );
            })()}

            {/* Top 3 Yant Preview */}
            {ranked.length > 0 && (
              <div style={{ marginBottom:36 }}>
                <div style={{ fontSize:10, letterSpacing:4, color:G, textTransform:"uppercase", marginBottom:22 }}>✦ Your Top Yants</div>
                <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  {ranked.slice(0,3).map((r, i) => (
                    <div key={r.key} onClick={()=>setDetail(r.key)} style={{
                      border:`1px solid ${i===0 ? G : SUB}`,
                      background: i===0 ? "rgba(201,168,76,0.06)" : "transparent",
                      padding:"24px 20px", cursor:"pointer",
                      display:"flex", gap:20, alignItems:"center", textAlign:"left",
                      transition:"all 0.2s ease",
                    }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor=G; e.currentTarget.style.background="rgba(201,168,76,0.04)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor=i===0?G:SUB; e.currentTarget.style.background=i===0?"rgba(201,168,76,0.06)":"transparent"; }}
                    >
                      <div style={{ flexShrink:0, textAlign:"center" }}>
                        <div style={{ fontSize:9, letterSpacing:2, color:G, marginBottom:6, opacity:0.7 }}>#{i+1}</div>
                        <div style={{ width:100, height:100, color: i===0 ? G : MID }} dangerouslySetInnerHTML={{ __html: r.yant.svg }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:15, color:WARM, marginBottom:2 }}>{r.yant.name}</div>
                        <div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:6 }}>{r.yant.thai} · {r.yant.meaning}</div>
                        <div style={{ fontSize:11, color:DIM, lineHeight:1.7 }}>{r.yant.description.slice(0, 160)}...</div>
                        <div style={{ marginTop:8, display:"flex", gap:6, flexWrap:"wrap" }}>
                          <span style={{ fontSize:8, letterSpacing:2, textTransform:"uppercase", color:ELEMENTS[r.yant.element]?.color || DIM }}>{ELEMENTS[r.yant.element]?.symbol} {ELEMENTS[r.yant.element]?.name}</span>
                          <span style={{ fontSize:8, letterSpacing:1, color:DIM }}>· {r.yant.placement}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:9, color:DIM, marginTop:10, letterSpacing:1 }}>Tap any yant to see full details</div>
              </div>
            )}

            {/* Offerings summary */}
            {offerings.size > 0 && (
              <div style={{ marginBottom:28, padding:"14px 18px", border:`1px solid ${SUB}`, background:"rgba(201,168,76,0.02)" }}>
                <div style={{ fontSize:9, letterSpacing:3, color:G, textTransform:"uppercase", marginBottom:8 }}>Your Offerings</div>
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  {OFFERINGS.filter(o => offerings.has(o.id)).map(o => (
                    <span key={o.id} style={{ fontSize:10, color:DIM, letterSpacing:1 }}>{o.icon} {o.label}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ width:60, height:1, background:`linear-gradient(90deg,transparent,${G},transparent)`, margin:"0 auto 28px" }} />
            <Btn primary onClick={()=>setPhase("library")}>Explore Full Library →</Btn>
            <div style={{ marginTop:14 }}>
              <button
                onClick={() => {
                  const sorted = Object.entries(elementProfile).sort((a,b) => b[1] - a[1]);
                  const primary = sorted[0][0];
                  const secondary = sorted[1][0];
                  const top3 = ranked.slice(0,3).map((r,i) => `${i+1}. ${r.yant.name} (${r.yant.thai}) — ${r.yant.meaning}`).join("\n");
                  const offeringsList = OFFERINGS.filter(o => offerings.has(o.id)).map(o => o.label).join(", ");
                  const text = `✦ Sak Yant Oracle — My Manifestation ✦\n\nPrimary Element: ${ELEMENTS[primary].name} (${ELEMENTS[primary].thai})\nSecondary Element: ${ELEMENTS[secondary].name} (${ELEMENTS[secondary].thai})\n\nMy Offerings: ${offeringsList || "None selected"}\n\nTop Recommended Yants:\n${top3}\n\n— Generated at sakyantoracle.com`;
                  navigator.clipboard.writeText(text).then(() => {
                    const btn = document.getElementById("share-btn");
                    if (btn) { btn.textContent = "✓ COPIED"; setTimeout(() => { btn.textContent = "SHARE YOUR READING"; }, 2000); }
                  });
                }}
                id="share-btn"
                style={{
                  background:"none", border:`1px solid ${SUB}`, color:DIM, padding:"10px 24px",
                  fontSize:9, letterSpacing:3, textTransform:"uppercase", cursor:"pointer",
                  fontFamily:"Georgia,serif", transition:"all 0.18s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#5A5040"; e.currentTarget.style.color=WARM; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=SUB; e.currentTarget.style.color=DIM; }}
              >Share Your Reading</button>
            </div>
          </div>
        )}

        {/* LIBRARY */}
        {phase==="library" && (
          <div style={{ paddingTop:44, paddingBottom:80 }}>
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:12 }}>
              <div>
                {ranked.length>0 && <div style={{ fontSize:10, letterSpacing:5, color:G, marginBottom:6, textTransform:"uppercase" }}>Reading Complete</div>}
                <h2 style={{ fontSize:20, fontWeight:"normal", color:WARM, margin:0, letterSpacing:1 }}>
                  {ranked.length>0 ? "Your Yant Library" : "Design Library"}
                </h2>
                <div style={{ fontSize:11, color:DIM, marginTop:3 }}>{collage.size} in collection · {yantEntries.length} total designs</div>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {Object.keys(journey).length > 0 && <Btn small onClick={()=>setPhase("journey")}>My Journey</Btn>}
                {collage.size>0 && <Btn primary small onClick={()=>setPhase("collage")}>View Collection ({collage.size})</Btn>}
                <Btn small onClick={reset}>Start Over</Btn>
              </div>
            </div>

            {/* Tabs */}
            {ranked.length>0 && (
              <div style={{ display:"flex", borderBottom:`1px solid ${SUB}`, marginBottom:20 }}>
                {["recommended","all"].map(t=>(
                  <button key={t} onClick={()=>setTab(t)} style={{
                    background:"transparent", border:"none", borderBottom:`2px solid ${tab===t?G:"transparent"}`,
                    color:tab===t?G:DIM, padding:"9px 18px", cursor:"pointer",
                    fontSize:10, letterSpacing:3, textTransform:"uppercase", fontFamily:"Georgia,serif",
                    marginBottom:-1, transition:"all 0.18s ease",
                  }}>{t==="recommended" ? "For You" : `All ${yantEntries.length} Designs`}</button>
                ))}
              </div>
            )}

            {/* Filter */}
            {(ranked.length===0 || tab==="all") && (
              <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
                {CATS.map(cat=>(
                  <button key={cat} onClick={()=>setFilter(cat)} style={{
                    background:filter===cat?G:"transparent", border:`1px solid ${filter===cat?G:SUB}`,
                    color:filter===cat?DARK:DIM, padding:"5px 14px", fontSize:9, letterSpacing:2,
                    textTransform:"uppercase", cursor:"pointer", fontFamily:"Georgia,serif", transition:"all 0.18s ease",
                  }}>{CAT_L[cat]}</button>
                ))}
              </div>
            )}

            {/* Grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(152px, 1fr))", gap:10 }}>
              {displayList.map(([key, yant])=>(
                <YantCard key={key} yantKey={key} yant={yant}
                  selected={collage.has(key)}
                  onSelect={()=>setDetail(key)}
                  onToggle={toggleCollage}
                  rank={rankMap[key] || null}
                />
              ))}
            </div>
            <div style={{ marginTop:14, fontSize:10, color:"#4A4030", textAlign:"center", letterSpacing:1 }}>
              Click any design to learn more · Use + Add to build your collection
            </div>
          </div>
        )}

        {/* COLLAGE */}
        {phase==="collage" && (
          <div style={{ paddingTop:44, paddingBottom:80 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32, flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontSize:10, letterSpacing:5, color:G, marginBottom:6, textTransform:"uppercase" }}>Your Sacred Collection</div>
                <h2 style={{ fontSize:20, fontWeight:"normal", color:WARM, margin:0 }}>{collage.size} Yant{collage.size!==1?"s":""} Selected</h2>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {Object.keys(journey).length > 0 && <Btn small onClick={()=>setPhase("journey")}>My Journey</Btn>}
                <Btn small onClick={()=>setPhase("library")}>← Back to Library</Btn>
              </div>
            </div>

            {collage.size===0 ? (
              <div style={{ textAlign:"center", padding:"60px 0", color:DIM }}>
                <div style={{ fontSize:28, marginBottom:14, opacity:0.25 }}>✦</div>
                <p style={{ fontSize:14 }}>No designs selected yet. Go back and choose your yants.</p>
              </div>
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(190px, 1fr))", gap:14, marginBottom:36 }}>
                  {[...collage].map(key=>{
                    const yant=YANTS[key]; if(!yant) return null;
                    return (
                      <div key={key} style={{ border:`1px solid ${G}`, background:"rgba(201,168,76,0.04)", padding:"22px 18px", display:"flex", flexDirection:"column", alignItems:"center", gap:11, cursor:"pointer" }}
                        onClick={()=>setDetail(key)}
                      >
                        <div style={{ width:110, height:110, color:G }} dangerouslySetInnerHTML={{ __html: yant.svg }} />
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontSize:14, color:WARM, marginBottom:2 }}>{yant.name}</div>
                          <div style={{ fontSize:11, color:DIM }}>{yant.thai}</div>
                        </div>
                        <div style={{ fontSize:10, color:DIM, textAlign:"center", lineHeight:1.5 }}>{yant.meaning}</div>
                        <div style={{ fontSize:11, color:DIM, textAlign:"center", lineHeight:1.5 }}>{yant.placement}</div>
                        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                          <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", border:`1px solid rgba(201,168,76,0.2)`, color:G, padding:"3px 10px" }}>{yant.energy}</div>
                          {yant.element && ELEMENTS[yant.element] && <div style={{ fontSize:8, letterSpacing:1, color:ELEMENTS[yant.element].color }}>{ELEMENTS[yant.element].symbol} {ELEMENTS[yant.element].name}</div>}
                        </div>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={(e)=>{e.stopPropagation(); toggleCollage(key);}} style={{ background:"none", border:`1px solid ${SUB}`, color:DIM, fontSize:9, letterSpacing:2, textTransform:"uppercase", padding:"5px 12px", cursor:"pointer", fontFamily:"Georgia,serif" }}>Remove</button>
                          <button onClick={(e)=>{e.stopPropagation(); setDetail(key);}} style={{ background:"none", border:`1px solid ${G}`, color:G, fontSize:9, letterSpacing:2, textTransform:"uppercase", padding:"5px 12px", cursor:"pointer", fontFamily:"Georgia,serif" }}>View Details</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ border:`1px solid ${SUB}`, padding:"26px 28px", marginBottom:28 }}>
                  <div style={{ fontSize:10, letterSpacing:4, color:G, textTransform:"uppercase", marginBottom:16 }}>✦ Placement & Collage Notes</div>
                  {[...collage].map(key=>{
                    const yant=YANTS[key]; if(!yant) return null;
                    return (
                      <div key={key} style={{ marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${SUB}` }}>
                        <div style={{ fontSize:12, color:WARM, marginBottom:3 }}>{yant.name} <span style={{ color:DIM, fontStyle:"italic" }}>— {yant.placement}</span></div>
                        <div style={{ fontSize:11, color:DIM, lineHeight:1.6 }}>{yant.collageNote}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Practitioner Section */}
                <div style={{ border:`1px solid ${G}`, padding:"32px 28px", marginBottom:28, textAlign:"center", background:"rgba(201,168,76,0.03)" }}>
                  <div style={{ fontSize:10, letterSpacing:5, color:G, textTransform:"uppercase", marginBottom:14 }}>✦ The Next Step</div>
                  <h3 style={{ fontSize:18, fontWeight:"normal", color:WARM, margin:"0 0 10px", fontStyle:"italic" }}>Bring This Reading to a Master</h3>
                  <p style={{ fontSize:12, lineHeight:1.8, color:DIM, marginBottom:20, maxWidth:380, margin:"0 auto 20px" }}>
                    Your manifestation is complete — but the yant is not yours until it's given by a qualified ajarn or monk. Share your reading, discuss your choices, and receive the blessing with respect and intention.
                  </p>
                  <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
                    <button
                      onClick={() => {
                        const yantNames = [...collage].map(k => YANTS[k]).filter(Boolean).map(y => `${y.name} (${y.thai})`).join(", ");
                        const sorted = elementProfile ? Object.entries(elementProfile).sort((a,b) => b[1] - a[1]) : [];
                        const primaryEl = sorted.length > 0 ? ELEMENTS[sorted[0][0]]?.name : "";
                        const text = `✦ Sak Yant Consultation Request ✦\n\nI've completed my Sak Yant Oracle reading and would like to discuss receiving the following designs:\n\nSelected Yants: ${yantNames}\n${primaryEl ? `Primary Element: ${primaryEl}` : ""}\n\nI approach with respect and sincere intent. I would like to learn more about receiving these yants in the traditional way.\n\n— Via Sak Yant Oracle`;
                        navigator.clipboard.writeText(text).then(() => {
                          const btn = document.getElementById("consult-btn");
                          if (btn) { btn.textContent = "✓ COPIED TO CLIPBOARD"; setTimeout(() => { btn.textContent = "COPY CONSULTATION REQUEST"; }, 2500); }
                        });
                      }}
                      id="consult-btn"
                      style={{
                        background:G, border:`1px solid ${G}`, color:DARK, padding:"12px 24px",
                        fontSize:10, letterSpacing:3, textTransform:"uppercase", cursor:"pointer",
                        fontFamily:"Georgia,serif", fontWeight:"bold",
                      }}
                    >Copy Consultation Request</button>
                    <button
                      onClick={() => {
                        const yantNames = [...collage].map(k => YANTS[k]).filter(Boolean).map(y => `${y.name} (${y.thai})`).join(", ");
                        const sorted = elementProfile ? Object.entries(elementProfile).sort((a,b) => b[1] - a[1]) : [];
                        const primaryEl = sorted.length > 0 ? `Primary Element: ${ELEMENTS[sorted[0][0]]?.name}` : "";
                        const summary = [...collage].map(k => { const y = YANTS[k]; if (!y) return ""; return `• ${y.name} — ${y.meaning}\n  Placement: ${y.placement}\n  ${y.collageNote}`; }).join("\n\n");
                        const text = `✦ My Sak Yant Collection ✦\n\n${primaryEl}\n\n${summary}\n\n— Generated at sakyantoracle.com`;
                        navigator.clipboard.writeText(text).then(() => {
                          const btn = document.getElementById("share-collection-btn");
                          if (btn) { btn.textContent = "✓ COPIED"; setTimeout(() => { btn.textContent = "SHARE COLLECTION"; }, 2000); }
                        });
                      }}
                      id="share-collection-btn"
                      style={{
                        background:"transparent", border:`1px solid ${SUB}`, color:DIM, padding:"12px 24px",
                        fontSize:10, letterSpacing:3, textTransform:"uppercase", cursor:"pointer",
                        fontFamily:"Georgia,serif",
                      }}
                    >Share Collection</button>
                  </div>
                </div>

                <div style={{ padding:"22px 24px", background:"rgba(201,168,76,0.02)", border:`1px solid rgba(201,168,76,0.06)`, textAlign:"center" }}>
                  <div style={{ fontSize:11, color:DIM, lineHeight:1.9, letterSpacing:0.5 }}>
                    Sak yants are sacred — not decorative.<br/>
                    Seek a legitimate monk or ajarn master in Thailand.<br/>
                    Approach with humility, offerings, and sincere intent.
                  </div>
                  <div style={{ fontSize:9, color:"#3A3020", letterSpacing:2, marginTop:10 }}>
                    Meanings vary by lineage, ajarn, and temple.<br/>
                    This app guides — it does not declare absolute truth.
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* MY JOURNEY */}
        {phase==="journey" && (
          <div style={{ paddingTop:44, paddingBottom:80 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:12 }}>
              <div>
                <div style={{ fontSize:10, letterSpacing:5, color:G, marginBottom:6, textTransform:"uppercase" }}>✦ My Sacred Journey</div>
                <h2 style={{ fontSize:20, fontWeight:"normal", color:WARM, margin:0, letterSpacing:1 }}>Your Sak Yant Plan</h2>
                <div style={{ fontSize:11, color:DIM, marginTop:3 }}>
                  {Object.values(journey).filter(v=>v==="have").length} received · {Object.values(journey).filter(v=>v==="next").length} planned · {Object.values(journey).filter(v=>v==="someday").length} someday
                </div>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <Btn small onClick={()=>setPhase("library")}>← Library</Btn>
                <Btn small onClick={()=>setPhase("collage")}>Collection</Btn>
              </div>
            </div>

            {/* Journey Filters */}
            <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
              {[["all","All"], ["have","Received ✓"], ["next","Getting Next"], ["someday","Someday"]].map(([val, label])=>(
                <button key={val} onClick={()=>setJourneyFilter(val)} style={{
                  background:journeyFilter===val?G:"transparent", border:`1px solid ${journeyFilter===val?G:SUB}`,
                  color:journeyFilter===val?DARK:DIM, padding:"5px 14px", fontSize:9, letterSpacing:2,
                  textTransform:"uppercase", cursor:"pointer", fontFamily:"Georgia,serif", transition:"all 0.18s ease",
                }}>{label}</button>
              ))}
            </div>

            {/* Add from library prompt */}
            {Object.keys(journey).length === 0 && (
              <div style={{ textAlign:"center", padding:"50px 20px", border:`1px dashed ${SUB}`, marginBottom:20 }}>
                <div style={{ fontSize:24, color:G, opacity:0.3, marginBottom:12 }}>✦</div>
                <p style={{ fontSize:13, color:DIM, marginBottom:16, lineHeight:1.7 }}>Your journey starts here. Browse the library and mark yants you have, want next, or dream about.</p>
                <Btn small onClick={()=>setPhase("library")}>Browse Library</Btn>
              </div>
            )}

            {/* Journey Cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {Object.entries(YANTS).filter(([key]) => {
                if (journeyFilter === "all") return journey[key];
                return journey[key] === journeyFilter;
              }).map(([key, yant]) => {
                const status = journey[key];
                const note = journeyNotes[key] || "";
                const statusColors = { have: "#4A7A5A", next: G, someday: "#5B7B8A" };
                const statusLabels = { have: "Received", next: "Getting Next", someday: "Someday" };
                return (
                  <div key={key} style={{
                    border:`1px solid ${status==="next"?G:SUB}`,
                    background: status==="have" ? "rgba(74,122,90,0.06)" : status==="next" ? "rgba(201,168,76,0.04)" : "transparent",
                    padding:"20px", display:"flex", gap:18, alignItems:"flex-start",
                  }}>
                    <div style={{ flexShrink:0, cursor:"pointer" }} onClick={()=>setDetail(key)}>
                      <div style={{ width:80, height:80, color: status==="have" ? "#4A7A5A" : status==="next" ? G : DIM }} dangerouslySetInnerHTML={{ __html: yant.svg }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:6 }}>
                        <div>
                          <div style={{ fontSize:14, color:WARM }}>{yant.name} <span style={{ fontSize:11, color:DIM }}>{yant.thai}</span></div>
                          <div style={{ fontSize:10, color:G, marginTop:2, letterSpacing:1 }}>{yant.meaning}</div>
                          <div style={{ fontSize:10, color:DIM, marginTop:1 }}>{yant.placement}</div>
                        </div>
                        <div style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", color:statusColors[status] || DIM, border:`1px solid ${statusColors[status] || SUB}`, padding:"3px 8px", flexShrink:0 }}>
                          {statusLabels[status] || status}
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize:11, color:DIM, lineHeight:1.7, margin:"0 0 10px" }}>{yant.description}</p>

                      {/* Traits & element */}
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
                        {yant.element && ELEMENTS[yant.element] && (
                          <span style={{ fontSize:8, letterSpacing:2, textTransform:"uppercase", border:`1px solid ${ELEMENTS[yant.element].color}`, color:ELEMENTS[yant.element].color, padding:"2px 6px" }}>{ELEMENTS[yant.element].symbol} {ELEMENTS[yant.element].name}</span>
                        )}
                        {yant.traits.slice(0,4).map(t=>(
                          <span key={t} style={{ fontSize:8, letterSpacing:1, textTransform:"uppercase", border:`1px solid rgba(201,168,76,0.15)`, color:G, padding:"2px 6px", opacity:0.7 }}>{t}</span>
                        ))}
                      </div>

                      {/* Status buttons */}
                      <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                        {["have","next","someday"].map(s => (
                          <button key={s} onClick={()=>setYantStatus(key, s)} style={{
                            background: status===s ? (statusColors[s]+"22") : "transparent",
                            border:`1px solid ${status===s ? statusColors[s] : SUB}`,
                            color: status===s ? statusColors[s] : DIM,
                            padding:"4px 10px", fontSize:8, letterSpacing:2, textTransform:"uppercase",
                            cursor:"pointer", fontFamily:"Georgia,serif", transition:"all 0.15s ease",
                          }}>{s==="have"?"✓ Have It":s==="next"?"Next":s==="someday"?"Someday":s}</button>
                        ))}
                      </div>

                      {/* Notes */}
                      {editingNote === key ? (
                        <div style={{ marginTop:6 }}>
                          <textarea
                            autoFocus
                            defaultValue={note}
                            onBlur={(e) => { updateNote(key, e.target.value); setEditingNote(null); }}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); updateNote(key, e.target.value); setEditingNote(null); }}}
                            placeholder="Add a personal note — when you got it, who gave it, how it felt..."
                            style={{
                              width:"100%", background:"rgba(255,255,255,0.03)", border:`1px solid ${SUB}`,
                              color:WARM, padding:"10px 12px", fontSize:12, lineHeight:1.6,
                              fontFamily:"Georgia,serif", resize:"vertical", minHeight:60,
                              outline:"none",
                            }}
                          />
                          <div style={{ fontSize:9, color:DIM, marginTop:4, letterSpacing:1 }}>Press Enter to save · Shift+Enter for new line</div>
                        </div>
                      ) : (
                        <div onClick={()=>setEditingNote(key)} style={{ cursor:"pointer", marginTop:4 }}>
                          {note ? (
                            <p style={{ fontSize:11, color:DIM, lineHeight:1.6, fontStyle:"italic", margin:0 }}>{note}</p>
                          ) : (
                            <p style={{ fontSize:10, color:"#3A3020", margin:0, letterSpacing:1 }}>+ Add a personal note</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary stats at bottom */}
            {Object.keys(journey).length > 0 && (
              <div style={{ marginTop:28, padding:"18px 22px", border:`1px solid ${SUB}`, background:"rgba(201,168,76,0.02)" }}>
                <div style={{ fontSize:10, letterSpacing:4, color:G, textTransform:"uppercase", marginBottom:12 }}>✦ Journey Summary</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:10 }}>
                  {[
                    ["Received", Object.values(journey).filter(v=>v==="have").length, "#4A7A5A"],
                    ["Getting Next", Object.values(journey).filter(v=>v==="next").length, G],
                    ["Someday", Object.values(journey).filter(v=>v==="someday").length, "#5B7B8A"],
                    ["Total Planned", Object.keys(journey).length, WARM],
                  ].map(([label, count, color]) => (
                    <div key={label} style={{ border:`1px solid ${SUB}`, padding:"12px" }}>
                      <div style={{ fontSize:20, color, marginBottom:2 }}>{count}</div>
                      <div style={{ fontSize:9, letterSpacing:2, color:DIM, textTransform:"uppercase" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {detail && YANTS[detail] && (
        <Modal yantKey={detail} yant={YANTS[detail]} inCollage={collage.has(detail)} onToggle={toggleCollage} onClose={()=>setDetail(null)} currentStatus={journey[detail]} onSetStatus={setYantStatus} />
      )}

      <style>{`
  * { box-sizing: border-box; }
  button { outline: none; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${DARK}; }
  ::-webkit-scrollbar-thumb { background: #2A2318; }
  @media (max-width: 600px) {
    h1 { font-size: 18px !important; letter-spacing: 2px !important; }
    h2 { font-size: 17px !important; }
  }
  html { -webkit-text-size-adjust: 100%; }
  body { margin: 0; overflow-x: hidden; }
`}</style>
    </div>
  );
}
