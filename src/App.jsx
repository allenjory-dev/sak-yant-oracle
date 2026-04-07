import { useState, useEffect, useMemo, useRef } from "react";
import QRCode from 'qrcode';

const TRANSLATIONS = {
  en: {
    // Intro
    sacred_geometry: "Sacred Geometry · Ancient Blessing",
    app_title: "Sak Yant Oracle",
    app_subtitle: "Tattoo Guidance & Design Library",
    intro_desc: "Sak yants are sacred geometric tattoos from Thailand, Cambodia, and Laos — blessed by monks and ajarn masters, carrying real spiritual weight.",
    intro_sub: "Walk through the four elements, offer your intentions, and receive a personalised yant manifestation. The journey takes about two minutes.",
    begin_reading: "Begin the Reading",
    browse_all: "Browse All",
    designs: "Designs",
    continue_journey: "Continue My Journey",
    yants_word: "yants",
    approach_respect: "Approach with Respect",
    disclaimer: "Meanings vary by lineage, ajarn, and temple. This app guides — it does not declare. Final design and placement should always be confirmed with a qualified practitioner.",
    // Elements
    elem_earth: "Earth", elem_water: "Water", elem_fire: "Fire", elem_air: "Air",
    elem_earth_desc: "Foundation · Roots · What you protect",
    elem_water_desc: "Depth · Intuition · What flows through you",
    elem_fire_desc: "Drive · Courage · What burns in you",
    elem_air_desc: "Vision · Freedom · What you reach toward",
    // Offerings
    off_protection: "Protection", off_fortune: "Good Fortune", off_courage: "Courage",
    off_love: "Love & Charisma", off_wisdom: "Wisdom", off_travel: "Safe Journeys",
    off_discipline: "Discipline", off_transformation: "Transformation", off_success: "Success",
    // Body Areas
    area_upper_back: "Upper Back", area_center_back: "Center Back", area_neck_spine: "Neck / Spine",
    area_shoulder: "Shoulder", area_chest: "Chest", area_upper_arm: "Upper Arm",
    area_forearm: "Forearm", area_thigh: "Thigh", area_calf: "Calf",
    // Quiz Nav
    back: "← Back", continue_btn: "Continue →", reveal_yants: "Reveal My Yants",
    of_word: "of", selected: "selected", select_at_least: "select at least",
    areas_selected: "area(s) selected",
    // Questions
    q_path: "How do you want to walk this path?",
    q_path_sub: "This shapes the guidance you'll receive.",
    q_path_opt1: "I seek a design that follows the ancestral lineage — traditional placement, traditional meaning",
    q_path_opt2: "I seek a design that serves as a personal symbolic anchor — meaning matters, but on my terms",
    q_path_opt3: "I'm still learning — guide me and I'll listen",
    q_earth: "What is the ground beneath your feet?",
    q_earth_sub: "Earth asks: what do you stand on?",
    q_earth_opt1: "My people — the ones I'd do anything for",
    q_earth_opt2: "My own two hands — what I've built and what I've survived",
    q_earth_opt3: "Something ancient — tradition, lineage, roots that go deeper than me",
    q_earth_opt4: "Honestly? I'm still building it",
    q_water: "What runs beneath your surface?",
    q_water_sub: "Water asks: what do you carry that others don't see?",
    q_water_opt1: "A deep intuition — I feel things before they happen",
    q_water_opt2: "Old pain I'm learning to release",
    q_water_opt3: "A quiet love that runs deeper than I show",
    q_water_opt4: "Restlessness — a current pulling me somewhere new",
    q_fire: "What would you walk through fire for?",
    q_fire_sub: "Fire asks: what makes you dangerous — in the best way?",
    q_fire_opt1: "The people I love — without hesitation",
    q_fire_opt2: "My own freedom — I refuse to be caged",
    q_fire_opt3: "Something I haven't built yet — a vision only I can see",
    q_fire_opt4: "What's right — I fight for justice even when it costs me",
    q_air: "Close your eyes. What do you see?",
    q_air_sub: "Air asks: what are you reaching toward?",
    q_air_opt1: "Stillness — peace after everything I've been through",
    q_air_opt2: "Abundance — I want life to overflow with good things",
    q_air_opt3: "Connection — being truly seen and deeply known",
    q_air_opt4: "The unknown — somewhere I haven't been yet",
    q_offerings: "Place your offerings on the table.",
    q_offerings_sub: "Choose 2 or 3 intentions you want your yant to carry.",
    q_balance: "Which element do you need more of?",
    q_balance_sub: "Not what you are — what's missing. The yant fills the gap.",
    q_balance_opt1: "Earth — I need grounding, roots, something solid beneath me",
    q_balance_opt2: "Water — I need to feel again, to release, to transform",
    q_balance_opt3: "Fire — I need courage, power, the will to finally act",
    q_balance_opt4: "Air — I need lightness, vision, room to breathe",
    q_placement: "Where on your body do you feel this belongs?",
    q_placement_sub: "Tap the areas you're open to. You can select multiple.",
    q_discretion: "Does this need to stay between you and the ink?",
    q_discretion_sub: "No judgment — practical needs shape the right choice.",
    q_discretion_opt1: "Yes — it should be easy to conceal",
    q_discretion_opt2: "I don't mind it showing sometimes",
    q_discretion_opt3: "I want it visible — this is part of who I am",
    q_collage: "One yant, or many?",
    q_collage_sub: "Many people build a sacred body map over years.",
    q_collage_opt1: "One perfect yant — singular and meaningful",
    q_collage_opt2: "A foundation piece to start my collection",
    q_collage_opt3: "I want a full collage — I'm thinking big",
    q_collage_opt4: "Not sure yet — show me what resonates",
    // Reading
    your_manifestation: "Your Manifestation",
    your_top_yants: "Your Top Yants",
    tap_details: "Tap any yant to see full details",
    your_offerings: "Your Offerings",
    explore_library: "Explore Full Library →",
    share_reading: "Share Your Reading",
    copied: "✓ Copied",
    primary_element_is: "Your primary element is",
    with_strong: "with strong",
    influence: "influence",
    reading_earth: "You are rooted — grounded in what matters, steady when the world shakes.",
    reading_water: "You run deep — feeling, transforming, carrying currents others can't see.",
    reading_fire: "You burn — courage, drive, a flame that refuses to go out.",
    reading_air: "You reach — always looking upward, outward, toward what could be.",
    combo_earth_water: "Rooted but flowing. You hold fast to what matters while letting go of what doesn't serve you.",
    combo_earth_fire: "Solid and fierce. You protect with the strength of mountains and the heat of conviction.",
    combo_earth_air: "Grounded yet expansive. Your roots go deep but your vision reaches far.",
    combo_water_fire: "Depth meets drive. You feel everything and channel it into unstoppable forward motion.",
    combo_water_air: "Intuitive and free. You sense what others miss and follow currents no one else can feel.",
    combo_fire_air: "Burning bright and reaching high. Pure ambition tempered by vision and openness.",
    // Library
    reading_complete: "Reading Complete",
    your_yant_library: "Your Yant Library",
    design_library: "Design Library",
    in_collection: "in collection",
    total_designs: "total designs",
    my_journey: "My Journey",
    view_collection: "View Collection",
    start_over: "Start Over",
    for_you: "For You",
    all_n_designs: "All Designs",
    cat_all: "All Designs", cat_geometric: "Geometric", cat_animal: "Animal Spirits", cat_deity: "Deities", cat_nature: "Nature",
    click_to_learn: "Click any design to learn more · Use + Add to build your collection",
    in_collection_btn: "✓ In Collection", add_btn: "+ Add",
    // Modal
    placement_label: "Placement", energy_label: "Energy", visibility_label: "Visibility", size_label: "Size",
    vis_hidden: "Easy to conceal", vis_semi: "Semi-hidden", vis_visible: "Visible",
    design_word: "design", collage_note: "Collage Note",
    see_photos: "See Real Tattoo Photos →",
    mark_journey: "Mark Your Journey",
    journey_have: "✓ I Have This", journey_next: "Getting Next", journey_someday: "Someday",
    remove_collection: "Remove from Collection", add_to_collection: "Add to Collection",
    // Collage
    your_sacred_collection: "Your Sacred Collection",
    yants_selected: "Yants Selected",
    no_designs_yet: "No designs selected yet. Go back and choose your yants.",
    placement_collage_notes: "Placement & Collage Notes",
    the_next_step: "The Next Step",
    bring_to_master: "Bring This Reading to a Master",
    next_step_desc: "Your manifestation is complete — but the yant is not yours until it's given by a qualified ajarn or monk. Share your reading, discuss your choices, and receive the blessing with respect and intention.",
    copy_consultation: "Copy Consultation Request", share_collection: "Share Collection",
    sacred_not_decorative: "Sak yants are sacred — not decorative.",
    seek_legitimate: "Seek a legitimate monk or ajarn master in Thailand.",
    approach_humility: "Approach with humility, offerings, and sincere intent.",
    meanings_vary: "Meanings vary by lineage, ajarn, and temple.",
    app_guides: "This app guides — it does not declare absolute truth.",
    remove_btn: "Remove", view_details: "View Details", back_to_library: "← Back to Library",
    // Journey
    my_sacred_journey: "My Sacred Journey",
    your_sak_yant_plan: "Your Sak Yant Plan",
    received_word: "received", planned_word: "planned", someday_word: "someday",
    library_btn: "← Library", collection_btn: "Collection",
    filter_all: "All", filter_received: "Received ✓", filter_next: "Getting Next", filter_someday: "Someday",
    journey_empty: "Your journey starts here. Browse the library and mark yants you have, want next, or dream about.",
    browse_library: "Browse Library",
    have_it: "✓ Have It", next_btn: "Next", someday_btn: "Someday",
    add_note: "+ Add a personal note",
    note_placeholder: "Add a personal note — when you got it, who gave it, how it felt...",
    note_save_hint: "Press Enter to save · Shift+Enter for new line",
    journey_summary: "Journey Summary",
    stat_received: "Received", stat_getting_next: "Getting Next", stat_someday: "Someday", stat_total: "Total Planned",
    language: "Language",
    // Body Preview
    preview_on_body: "Preview on Body",
    try_it_on: "Try It On",
    front_view: "Front",
    back_view: "Back",
    tap_to_place: "Tap a body area to preview placement",
    preview_placement: "Preview Placement",
    // QR Code & New Features
    qr_generate: "Generate QR Code",
    qr_scan_text: "Your ajarn can scan this to see your reading",
    qr_close: "Close",
    sound_on: "♪ On",
    sound_off: "♪ Off",
    gallery_title: "Practitioner Gallery",
    gallery_subtitle: "Sacred Artistry",
    gallery_desc: "A curated collection of real Sak Yant work from verified ajarn masters. Coming soon.",
    gallery_coming_soon: "Coming Soon",
    gallery_practitioners: "For Practitioners",
    gallery_practitioners_desc: "Are you a Sak Yant ajarn or monk? Showcase your sacred work to seekers worldwide.",
    gallery_contact: "Contact: sakyantoracle@gmail.com",
    gallery_back: "← Back to Home",
    practitioner_gallery: "Practitioner Gallery",
  },
  th: {
    // Intro
    sacred_geometry: "เรขาคณิตศักดิ์สิทธิ์ · สิ่งศักดิ์สิทธิ์โบราณ",
    app_title: "สักยันต์ออราเคิล",
    app_subtitle: "คำแนะนำสักยันต์ & ห้องสมุดออกแบบ",
    intro_desc: "สักยันต์เป็นรูปลักษณ์เรขาคณิตศักดิ์สิทธิ์จากประเทศไทย กัมพูชา และลาว — พระสงค์และครูบาอาจารย์ให้พร หนักสำคัญและมีจิตใจจริง",
    intro_sub: "เดินผ่านธาตุสี่ประการ มอบจิตสำนึกของคุณ และรับการแสดงตนของยันต์ส่วนตัวของคุณ การเดินทางใช้เวลาประมาณสองนาที",
    begin_reading: "เริ่มการทำนาย",
    browse_all: "ดูทั้งหมด",
    designs: "ออกแบบ",
    continue_journey: "ดำเนินการเดินทางของฉัน",
    yants_word: "ยันต์",
    approach_respect: "ด้วยความเคารพ",
    disclaimer: "ความหมายแตกต่างกันไปตามวงศ์วาน ครูบาอาจารย์ และวัดต่างๆ แอปนี้คือการแนะนำ — ไม่ได้ประกาศ ควรยืนยันการออกแบบและตำแหน่งสุดท้ายกับผู้ปฏิบัติที่มีคุณวุฒิเสมอ",
    // Elements
    elem_earth: "ดิน", elem_water: "น้ำ", elem_fire: "ไฟ", elem_air: "ลม",
    elem_earth_desc: "รากฐาน · เหยื่อ · สิ่งที่คุณปกป้อง",
    elem_water_desc: "ความลึก · สัญชาตญาณ · สิ่งที่ไหลผ่านคุณ",
    elem_fire_desc: "แรงผลักดัน · ความกล้าหาญ · สิ่งที่ลุกโชนในคุณ",
    elem_air_desc: "วิสัยทัศน์ · เสรีภาพ · สิ่งที่คุณมุ่งไปถึง",
    // Offerings
    off_protection: "การปกป้อง", off_fortune: "โชคดี", off_courage: "ความกล้าหาญ",
    off_love: "ความรักและเสนห์", off_wisdom: "ปัญญา", off_travel: "การเดินทางที่ปลอดภัย",
    off_discipline: "วินัย", off_transformation: "การเปลี่ยนแปลง", off_success: "ความสำเร็จ",
    // Body Areas
    area_upper_back: "ตรงกลางลังกา", area_center_back: "ส่วนกลางลังกา", area_neck_spine: "คอ / สันหลัง",
    area_shoulder: "ไหล่", area_chest: "หน้าอก", area_upper_arm: "แขนบน",
    area_forearm: "แขนล่าง", area_thigh: "ต้นขา", area_calf: "แข้ง",
    // Quiz Nav
    back: "← ย้อนกลับ", continue_btn: "ต่อไป →", reveal_yants: "เปิดเผยยันต์ของฉัน",
    of_word: "ของ", selected: "เลือกแล้ว", select_at_least: "เลือกอย่างน้อย",
    areas_selected: "พื้นที่เลือก",
    // Questions
    q_path: "คุณต้องการเดินทางบนเส้นทางนี้อย่างไร",
    q_path_sub: "สิ่งนี้กำหนดรูปของคำแนะนำที่คุณจะได้รับ",
    q_path_opt1: "ฉันต้องการออกแบบที่ตามบรรพบุรุษ — การวางตำแหน่งแบบเดิม ความหมายแบบเดิม",
    q_path_opt2: "ฉันต้องการออกแบบที่ทำหน้าที่เป็นสัญลักษณ์ส่วนตัวของฉัน — ความหมายสำคัญ แต่ตามเงื่อนไขของฉัน",
    q_path_opt3: "ฉันยังเรียนรู้อยู่ — แนะนำฉันและฉันจะฟัง",
    q_earth: "พื้นดินใต้เท้าของคุณคืออะไร",
    q_earth_sub: "ดินถาม: คุณยืนบนอะไร",
    q_earth_opt1: "ชาวบ้านของฉัน — พวกที่ฉันจะทำอะไรก็ได้เพื่อเขา",
    q_earth_opt2: "มือของฉันเอง — สิ่งที่ฉันสร้างและสิ่งที่ฉันรอด",
    q_earth_opt3: "สิ่งโบราณ — วัฒนธรรม วงศ์วาน รากที่ลึกกว่าตัวฉัน",
    q_earth_opt4: "พูดตามตรง ฉันยังสร้างมันอยู่",
    q_water: "อะไรไหลอยู่ใต้พื้นผิวของคุณ",
    q_water_sub: "น้ำถาม: คุณแบกอะไรที่คนอื่นไม่เห็น",
    q_water_opt1: "สัญชาตญาณลึกๆ — ฉันรู้สึกว่าสิ่งต่างๆจะเกิดขึ้นก่อนที่มันจะเกิด",
    q_water_opt2: "ความเจ็บปวดเก่า ฉันกำลังเรียนรู้ที่จะปล่อยมันไป",
    q_water_opt3: "ความรักเงียบๆที่ลึกกว่าที่ฉันแสดง",
    q_water_opt4: "ความกระสับกระส่ายไม่สงบ — กระแสที่ดึงฉันไปที่ใหม่",
    q_fire: "คุณจะเดินผ่านไฟได้อะไร",
    q_fire_sub: "ไฟถาม: อะไรทำให้คุณอันตราย — ด้วยวิธีที่ดี",
    q_fire_opt1: "ผู้คนที่ฉันรัก — โดยไม่ลังเล",
    q_fire_opt2: "เสรีภาพของฉันเอง — ฉันปฏิเสธที่จะถูกจำกัด",
    q_fire_opt3: "สิ่งที่ฉันยังไม่สร้าง — วิสัยทัศน์ที่เฉพาะตัวฉันเท่านั้น",
    q_fire_opt4: "สิ่งที่ถูกต้อง — ฉันสู้เพื่อความยุติธรรม แม้ว่ามันจะเสียสละฉัน",
    q_air: "ปิดตาของคุณ คุณเห็นอะไร",
    q_air_sub: "ลมถาม: คุณมุ่งไปยังอะไร",
    q_air_opt1: "ความสงบ — สหายหลังจากทุกอย่างที่ฉันผ่านมา",
    q_air_opt2: "ความอุดมสมบูรณ์ — ฉันต้องการให้ชีวิตล้นเหลือด้วยสิ่งดี",
    q_air_opt3: "การเชื่อมต่อ — เห็นด้วยตาตรงและรู้จักลึก",
    q_air_opt4: "สิ่งที่ไม่รู้จัก — ที่ไหนสักแห่งที่ฉันยังไม่เคยไป",
    q_offerings: "วางเครื่องบูชาบนโต๊ะ",
    q_offerings_sub: "เลือกคำขออ้อนวอน 2 หรือ 3 อย่างที่คุณต้องการให้ยันต์แบกหามไป",
    q_balance: "ธาตุไหนที่คุณต้องการเพิ่มเติม",
    q_balance_sub: "ไม่ใช่สิ่งที่คุณเป็น — สิ่งที่หายไป ยันต์เติมเต็มช่องว่าง",
    q_balance_opt1: "ดิน — ฉันต้องการรากฐาน ราก บางสิ่งบางอย่างที่มั่นคงใต้ตัวฉัน",
    q_balance_opt2: "น้ำ — ฉันต้องการรู้สึกอีกครั้ง ปล่อยมันไป เปลี่ยนแปลง",
    q_balance_opt3: "ไฟ — ฉันต้องการความกล้าหาญ อำนาจ จิตสำนึกในการกระทำ",
    q_balance_opt4: "ลม — ฉันต้องการความเบา วิสัยทัศน์ ที่ว่างสำหรับหายใจ",
    q_placement: "คุณรู้สึกว่าสิ่งนี้อยู่ที่ตำแหน่งไหนในร่างกายของคุณ",
    q_placement_sub: "แตะพื้นที่ที่คุณเปิดกว้าง คุณสามารถเลือกหลายอย่าง",
    q_discretion: "สิ่งนี้ต้องอยู่ระหว่างคุณและหมึกหรือไม่",
    q_discretion_sub: "ไม่มีการตัดสิน — ความต้องการในทางปฏิบัติสร้างรูปแบบที่ถูกต้อง",
    q_discretion_opt1: "ใช่ — ควรซ่อนได้ง่าย",
    q_discretion_opt2: "ฉันไม่ว่าถ้ามันแสดงบางครั้ง",
    q_discretion_opt3: "ฉันต้องการให้มองเห็น — นี่คือส่วนหนึ่งของตัวฉัน",
    q_collage: "ยันต์หนึ่งอันหรือมากกว่า",
    q_collage_sub: "หลายคนสร้างแผนที่ลำดับเหตุการณ์ศักดิ์สิทธิ์ตลอดปี",
    q_collage_opt1: "ยันต์เดียวที่สมบูรณ์แบบ — เดี่ยวและมีความหมาย",
    q_collage_opt2: "ชิ้นรากฐาน เพื่อเริ่มต้นคอลเลกชันของฉัน",
    q_collage_opt3: "ฉันต้องการการอ้อมค้อม — ฉันคิดอย่างใหญ่โต",
    q_collage_opt4: "ยังไม่แน่ใจ — แสดงสิ่งที่ตรงกับฉัน",
    // Reading
    your_manifestation: "การแสดงตนของคุณ",
    your_top_yants: "ยันต์สำคัญของคุณ",
    tap_details: "แตะยันต์ใดๆ เพื่อดูรายละเอียดทั้งหมด",
    your_offerings: "เครื่องบูชาของคุณ",
    explore_library: "สำรวจห้องสมุดแบบเต็ม →",
    share_reading: "แบ่งปันการทำนายของคุณ",
    copied: "✓ คัดลอกแล้ว",
    primary_element_is: "ธาตุหลักของคุณคือ",
    with_strong: "พร้อมกับ",
    influence: "อิทธิพล",
    reading_earth: "คุณมีรากฐาน — มั่นคงในสิ่งที่สำคัญ มั่นคงเมื่อโลกสั่นไหว",
    reading_water: "คุณไหลลึก — รู้สึก เปลี่ยนแปลง แบกกระแสที่คนอื่นไม่เห็น",
    reading_fire: "คุณลุกโชน — ความกล้าหาญ แรงผลักดัน เปลวไฟที่ปฏิเสธที่จะดับ",
    reading_air: "คุณมุ่งไป — มองขึ้นไป นอก ไปยังสิ่งที่อาจเป็น",
    combo_earth_water: "มีรากแต่ไหลลื่น คุณยึดมั่นในสิ่งที่สำคัญขณะปล่อยสิ่งที่ไม่ให้บริการแก่คุณ",
    combo_earth_fire: "มั่นคงและดุร้าย คุณปกป้องด้วยพลังของภูเขาและความร้อนแรงของการมุ่งมั่น",
    combo_earth_air: "มีรากแต่ขยายออก รากของคุณลึก แต่วิสัยทัศน์ของคุณไกล",
    combo_water_fire: "ความลึกพบแรงผลักดัน คุณรู้สึกทั้งหมดและนำมันไปสู่การเคลื่อนไปข้างหน้าที่ไม่อาจหยุดได้",
    combo_water_air: "สัญชาตญาณและเสรีภาพ คุณรู้สึกว่าสิ่งที่คนอื่นพลาด และตามกระแสที่ไม่มีใครสามารถรู้สึกได้",
    combo_fire_air: "ลุกโชนสดใสและมุ่งสูง ความทะเยาะทะยานล้วนๆผ่อนคลายด้วยวิสัยทัศน์และการเปิดกว้าง",
    // Library
    reading_complete: "การทำนายเสร็จสิ้น",
    your_yant_library: "ห้องสมุดยันต์ของคุณ",
    design_library: "ห้องสมุดออกแบบ",
    in_collection: "ในคอลเลกชัน",
    total_designs: "ออกแบบทั้งหมด",
    my_journey: "การเดินทางของฉัน",
    view_collection: "ดูคอลเลกชัน",
    start_over: "เริ่มต้นใหม่",
    for_you: "สำหรับคุณ",
    all_n_designs: "ออกแบบทั้งหมด",
    cat_all: "ออกแบบทั้งหมด", cat_geometric: "เรขาคณิต", cat_animal: "วิญญาณสัตว์", cat_deity: "เทวดา", cat_nature: "ธรรมชาติ",
    click_to_learn: "คลิกออกแบบใดๆ เพื่อเรียนรู้เพิ่มเติม · ใช้ + เพิ่มเพื่อสร้างคอลเลกชันของคุณ",
    in_collection_btn: "✓ ในคอลเลกชัน", add_btn: "+ เพิ่ม",
    // Modal
    placement_label: "ตำแหน่ง", energy_label: "พลังงาน", visibility_label: "ความมองเห็น", size_label: "ขนาด",
    vis_hidden: "ซ่อนได้ง่าย", vis_semi: "ซ่อนเพียงบางส่วน", vis_visible: "มองเห็น",
    design_word: "ออกแบบ", collage_note: "บันทึกการรวบรวม",
    see_photos: "ดูรูปภาพสักจริง →",
    mark_journey: "ทำเครื่องหมายการเดินทางของคุณ",
    journey_have: "✓ ฉันมีสิ่งนี้", journey_next: "จะได้รับต่อไป", journey_someday: "วันหนึ่ง",
    remove_collection: "นำออกจากคอลเลกชัน", add_to_collection: "เพิ่มลงในคอลเลกชัน",
    // Collage
    your_sacred_collection: "คอลเลกชันศักดิ์สิทธิ์ของคุณ",
    yants_selected: "ยันต์ที่เลือก",
    no_designs_yet: "ยังไม่มีออกแบบเลือก กลับไปและเลือกยันต์ของคุณ",
    placement_collage_notes: "ตำแหน่งและบันทึกการอ้อมค้อม",
    the_next_step: "ขั้นตอนถัดไป",
    bring_to_master: "นำการทำนายนี้ไปยังครูบา",
    next_step_desc: "การแสดงตนของคุณเสร็จสิ้น — แต่ยันต์ไม่ใช่ของคุณจนกว่าจะได้รับจากครูบาอาจารย์หรือพระสงค์ที่มีคุณวุฒิ แบ่งปันการทำนายของคุณ อภิปรายตัวเลือกของคุณ และรับการอวยพรด้วยความเคารพและจิตสำนึก",
    copy_consultation: "คัดลอกคำขอปรึกษา", share_collection: "แบ่งปันคอลเลกชัน",
    sacred_not_decorative: "สักยันต์ศักดิ์สิทธิ์ — ไม่ใช่ตกแต่ง",
    seek_legitimate: "หาครูบาอาจารย์หรือพระสงค์ที่มีหลักเกณฑ์ในประเทศไทย",
    approach_humility: "ด้วยความเป็นสามัญชน เครื่องบูชา และจิตสำนึกอันจริงใจ",
    meanings_vary: "ความหมายแตกต่างกันไปตามวงศ์วาน ครูบาอาจารย์ และวัดต่างๆ",
    app_guides: "แอปนี้เป็นการแนะนำ — ไม่ได้ประกาศความจริงแบบสัมบูรณ์",
    remove_btn: "นำออก", view_details: "ดูรายละเอียด", back_to_library: "← กลับไปยังห้องสมุด",
    // Journey
    my_sacred_journey: "การเดินทางศักดิ์สิทธิ์ของฉัน",
    your_sak_yant_plan: "แผนสักยันต์ของคุณ",
    received_word: "ได้รับ", planned_word: "วางแผน", someday_word: "วันหนึ่ง",
    library_btn: "← ห้องสมุด", collection_btn: "คอลเลกชัน",
    filter_all: "ทั้งหมด", filter_received: "ได้รับ ✓", filter_next: "จะได้รับต่อไป", filter_someday: "วันหนึ่ง",
    journey_empty: "การเดินทางของคุณเริ่มต้นที่นี่ สำรวจห้องสมุดและทำเครื่องหมายยันต์ที่คุณมี ต้องการถัดไป หรือฝันเกี่ยวกับ",
    browse_library: "สำรวจห้องสมุด",
    have_it: "✓ มีแล้ว", next_btn: "ถัดไป", someday_btn: "วันหนึ่ง",
    add_note: "+ เพิ่มบันทึกส่วนตัว",
    note_placeholder: "เพิ่มบันทึกส่วนตัว — เมื่อคุณได้มัน ใครให้มัน ความรู้สึกเป็นอย่างไร...",
    note_save_hint: "กดปุ่ม Enter เพื่อบันทึก · Shift+Enter สำหรับบรรทัดใหม่",
    journey_summary: "สรุปการเดินทาง",
    stat_received: "ได้รับ", stat_getting_next: "จะได้รับต่อไป", stat_someday: "วันหนึ่ง", stat_total: "ทั้งหมดวางแผน",
    language: "ภาษา",
  },
  ja: {
    // Intro
    sacred_geometry: "神聖な幾何学 · 古き祝福",
    app_title: "サクヤント・オラクル",
    app_subtitle: "タットゥーの指南 & デザイン図書館",
    intro_desc: "サクヤントはタイ、カンボジア、ラオスから生まれた神聖な幾何学的タットゥー — 僧侶とアジャルン・マスターによる祝福を受け、本当の霊的な重みを持ちます。",
    intro_sub: "四つの要素を歩み、あなたの意図を捧げ、個人化されたヤントの顕現を受け取ってください。この旅は約2分かかります。",
    begin_reading: "リーディングを始める",
    browse_all: "すべて見る",
    designs: "デザイン",
    continue_journey: "私の旅を続ける",
    yants_word: "ヤント",
    approach_respect: "敬意を持って",
    disclaimer: "意味は流派、アジャルン、寺院によって異なります。このアプリは指南です — 宣言ではありません。最終的なデザインと配置は、常に資格のある実践者と確認してください。",
    // Elements
    elem_earth: "地", elem_water: "水", elem_fire: "火", elem_air: "風",
    elem_earth_desc: "基礎 · 根 · あなたが守るもの",
    elem_water_desc: "深さ · 直感 · あなたを流れるもの",
    elem_fire_desc: "推進力 · 勇気 · あなたの中で燃えるもの",
    elem_air_desc: "ビジョン · 自由 · あなたが向かう先",
    // Offerings
    off_protection: "守護", off_fortune: "幸運", off_courage: "勇気",
    off_love: "愛と魅力", off_wisdom: "知恵", off_travel: "安全な旅",
    off_discipline: "規律", off_transformation: "変容", off_success: "成功",
    // Body Areas
    area_upper_back: "上背部", area_center_back: "背中中央", area_neck_spine: "首 / 脊椎",
    area_shoulder: "肩", area_chest: "胸", area_upper_arm: "上腕",
    area_forearm: "前腕", area_thigh: "大腿", area_calf: "ふくらはぎ",
    // Quiz Nav
    back: "← 戻る", continue_btn: "続ける →", reveal_yants: "ヤントを公開する",
    of_word: "の", selected: "選択済み", select_at_least: "少なくとも選択",
    areas_selected: "エリア選択済み",
    // Questions
    q_path: "この道をどのように歩みたいですか?",
    q_path_sub: "これはあなたが受け取る指南の形を決めます。",
    q_path_opt1: "祖先の系譜に従うデザインを求めています — 伝統的な配置、伝統的な意味",
    q_path_opt2: "個人的な象徴的な錨として機能するデザインを求めています — 意味は重要ですが、私の条件で",
    q_path_opt3: "まだ学んでいる途中です — 導いてください、耳を傾けます",
    q_earth: "あなたの足下の大地は何ですか?",
    q_earth_sub: "地は問います: あなたは何の上に立っていますか?",
    q_earth_opt1: "私の人々 — 彼らのためなら何でもしたい人たち",
    q_earth_opt2: "私自身の両手 — 私が築いたもの、そして生き残ったもの",
    q_earth_opt3: "何か古いもの — 伝統、系譜、私自身より深い根",
    q_earth_opt4: "正直に言えば、まだ築いている途中",
    q_water: "あなたの表面下には何が流れていますか?",
    q_water_sub: "水は問います: あなたは何を抱えていますか、他の人には見えないもの?",
    q_water_opt1: "深い直感 — 起こる前に物事を感じます",
    q_water_opt2: "古い痛み — 手放すことを学んでいます",
    q_water_opt3: "静かな愛 — 見せる以上に深い",
    q_water_opt4: "落ち着きのなさ — どこか新しい場所へと私を引く流れ",
    q_fire: "火を通して歩むことができることは何ですか?",
    q_fire_sub: "火は問います: 何があなたを危険にしますか — 最善の意味で?",
    q_fire_opt1: "私が愛する人々 — ためらうことなく",
    q_fire_opt2: "私自身の自由 — 檻に入ることを拒否します",
    q_fire_opt3: "まだ築いていないもの — 私だけが見ることのできるビジョン",
    q_fire_opt4: "何が正しいか — たとえそれが私に代価を払わせても、正義のために戦います",
    q_air: "目を閉じてください。何が見えますか?",
    q_air_sub: "風は問います: あなたは何に向かっていますか?",
    q_air_opt1: "静寂 — 私が経験したすべての後の平和",
    q_air_opt2: "豊かさ — 人生を良いもので満たしたい",
    q_air_opt3: "つながり — 本当に見られ、深く知られること",
    q_air_opt4: "未知のもの — まだ行ったことのない場所",
    q_offerings: "テーブルに供え物を置いてください。",
    q_offerings_sub: "あなたのヤントに込めたい2～3つの意図を選んでください。",
    q_balance: "どの要素がもっと必要ですか?",
    q_balance_sub: "あなたが何かではなく — 欠けているもの。ヤントが隙間を埋めます。",
    q_balance_opt1: "地 — 地盤、根、私の下の確かなもの",
    q_balance_opt2: "水 — もう一度感じたい、手放したい、変わりたい",
    q_balance_opt3: "火 — 勇気、力、ついに行動する意志",
    q_balance_opt4: "風 — 軽さ、ビジョン、呼吸する空間",
    q_placement: "これがあなたの体のどこに属すると感じますか?",
    q_placement_sub: "開かれた領域をタップしてください。複数選択できます。",
    q_discretion: "これはあなたとインクの間に留まる必要がありますか?",
    q_discretion_sub: "判断ありません — 実用的な必要性が正しい選択を形作ります。",
    q_discretion_opt1: "はい — 簡単に隠すことができるべき",
    q_discretion_opt2: "時々見えることは気になりません",
    q_discretion_opt3: "見えるようにしたい — これは私の一部です",
    q_collage: "1つのヤント、それとも複数?",
    q_collage_sub: "多くの人々は何年にもわたって神聖な身体図を築きます。",
    q_collage_opt1: "1つの完璧なヤント — 単数で意味深い",
    q_collage_opt2: "私のコレクションを始めるための基礎",
    q_collage_opt3: "完全なコラージュが欲しい — 大きく考えています",
    q_collage_opt4: "まだ確信が持てない — 共鳴するものを見せてください",
    // Reading
    your_manifestation: "あなたの顕現",
    your_top_yants: "あなたのトップ・ヤント",
    tap_details: "ヤントをタップして詳細を見てください",
    your_offerings: "あなたの供え物",
    explore_library: "完全なライブラリを見る →",
    share_reading: "あなたのリーディングを共有する",
    copied: "✓ コピーしました",
    primary_element_is: "あなたの主要要素は",
    with_strong: "強い",
    influence: "影響力を持つ",
    reading_earth: "あなたは根を張っています — 重要なものにしっかり、世界が揺れるときに安定しています。",
    reading_water: "あなたは深く流れています — 感じ、変わり、他の人には見えない流れを運びます。",
    reading_fire: "あなたは燃えています — 勇気、推進力、消えることを拒否する炎。",
    reading_air: "あなたは向かっています — 常に上を、外を、あり得たはずのものへ見つめています。",
    combo_earth_water: "根を張るが流動的。重要なもので固く守りながら、あなたに奉仕しないものを手放します。",
    combo_earth_fire: "堅実で激しい。山の強さと信念の炎で守ります。",
    combo_earth_air: "根を張るが広がる。あなたの根は深いが、ビジョンは遠い。",
    combo_water_fire: "深さが推進力に出会う。すべてを感じ、それを止められない前進に導きます。",
    combo_water_air: "直感的で自由。他の人が見落とすものを感じ、誰も感じることができない流れに従います。",
    combo_fire_air: "明るく燃えて高く向かう。純粋な野心はビジョンと開放性で和らげられます。",
    // Library
    reading_complete: "リーディング完了",
    your_yant_library: "あなたのヤント・ライブラリ",
    design_library: "デザイン・ライブラリ",
    in_collection: "コレクション内",
    total_designs: "デザイン合計",
    my_journey: "私の旅",
    view_collection: "コレクションを見る",
    start_over: "もう一度始める",
    for_you: "あなたへ",
    all_n_designs: "すべてのデザイン",
    cat_all: "すべてのデザイン", cat_geometric: "幾何学的", cat_animal: "動物精神", cat_deity: "神仏", cat_nature: "自然",
    click_to_learn: "デザインをクリックして詳しく知る · + 追加を使ってコレクションを構築",
    in_collection_btn: "✓ コレクション内", add_btn: "+ 追加",
    // Modal
    placement_label: "配置", energy_label: "エネルギー", visibility_label: "視認性", size_label: "サイズ",
    vis_hidden: "簡単に隠せる", vis_semi: "部分的に隠せる", vis_visible: "見える",
    design_word: "デザイン", collage_note: "コラージュノート",
    see_photos: "本物のタットゥー写真を見る →",
    mark_journey: "あなたの旅を記す",
    journey_have: "✓ 持っています", journey_next: "次に取得", journey_someday: "いつか",
    remove_collection: "コレクションから削除", add_to_collection: "コレクションに追加",
    // Collage
    your_sacred_collection: "あなたの神聖なコレクション",
    yants_selected: "選択されたヤント",
    no_designs_yet: "まだデザインは選択されていません。戻ってヤントを選んでください。",
    placement_collage_notes: "配置とコラージュノート",
    the_next_step: "次のステップ",
    bring_to_master: "このリーディングをマスターに持ってきてください",
    next_step_desc: "あなたの顕現は完了しました — しかしヤントは資格のあるアジャルンまたは僧侶によって与えられるまではあなたのものではありません。あなたのリーディングを共有し、あなたの選択を議論し、敬意と意図を持って祝福を受けてください。",
    copy_consultation: "相談リクエストをコピー", share_collection: "コレクションを共有",
    sacred_not_decorative: "サクヤントは神聖です — 装飾的ではありません。",
    seek_legitimate: "タイの正当な僧侶またはアジャルン・マスターを探してください。",
    approach_humility: "謙虚さ、供え物、そして誠実な意図を持って。",
    meanings_vary: "意味は流派、アジャルン、寺院によって異なります。",
    app_guides: "このアプリは指南です — 絶対的な真実を宣言するものではありません。",
    remove_btn: "削除", view_details: "詳細を見る", back_to_library: "← ライブラリに戻る",
    // Journey
    my_sacred_journey: "私の神聖な旅",
    your_sak_yant_plan: "あなたのサクヤント計画",
    received_word: "受取", planned_word: "計画中", someday_word: "いつか",
    library_btn: "← ライブラリ", collection_btn: "コレクション",
    filter_all: "すべて", filter_received: "受け取ったもの ✓", filter_next: "次に取得", filter_someday: "いつか",
    journey_empty: "あなたの旅はここから始まります。ライブラリを見て、持っている、次に欲しい、または夢見ているヤントを記してください。",
    browse_library: "ライブラリを見る",
    have_it: "✓ 持っています", next_btn: "次へ", someday_btn: "いつか",
    add_note: "+ 個人的なメモを追加",
    note_placeholder: "個人的なメモを追加 — いつ取得したか、誰から受け取ったか、どう感じたか...",
    note_save_hint: "Enterキーを押して保存 · Shift+Enterで新しい行",
    journey_summary: "旅のサマリー",
    stat_received: "受け取ったもの", stat_getting_next: "次に取得", stat_someday: "いつか", stat_total: "計画済み合計",
    language: "言語",
  },
  zh: {
    // Intro
    sacred_geometry: "神圣几何 · 古老祝福",
    app_title: "圣纹卦象",
    app_subtitle: "纹身指南 & 设计库",
    intro_desc: "圣纹是来自泰国、柬埔寨和老挝的神圣几何纹身——由僧侣和阿赞大师祝福，承载真实的精神重量。",
    intro_sub: "走过四大元素，献上你的意图，接收个性化的卦象显现。这段旅程大约需要两分钟。",
    begin_reading: "开始占卜",
    browse_all: "查看全部",
    designs: "设计",
    continue_journey: "继续我的旅程",
    yants_word: "卦象",
    approach_respect: "恭敬对待",
    disclaimer: "意义因流派、阿赞和寺庙而异。此应用提供指导——并非绝对声明。最终设计和位置应始终与合格的从业者确认。",
    // Elements
    elem_earth: "土", elem_water: "水", elem_fire: "火", elem_air: "风",
    elem_earth_desc: "基础 · 根源 · 你所守护的",
    elem_water_desc: "深度 · 直觉 · 流经你的",
    elem_fire_desc: "驱动 · 勇气 · 在你心中燃烧的",
    elem_air_desc: "视野 · 自由 · 你所追求的",
    // Offerings
    off_protection: "守护", off_fortune: "好运", off_courage: "勇气",
    off_love: "爱与魅力", off_wisdom: "智慧", off_travel: "安全旅程",
    off_discipline: "纪律", off_transformation: "蜕变", off_success: "成功",
    // Body Areas
    area_upper_back: "背部上方", area_center_back: "背部中央", area_neck_spine: "颈部 / 脊椎",
    area_shoulder: "肩膀", area_chest: "胸部", area_upper_arm: "上臂",
    area_forearm: "前臂", area_thigh: "大腿", area_calf: "小腿",
    // Quiz Nav
    back: "← 返回", continue_btn: "继续 →", reveal_yants: "揭示我的卦象",
    of_word: "的", selected: "已选择", select_at_least: "至少选择",
    areas_selected: "个区域已选择",
    // Questions
    q_path: "你想如何踏上这条路?",
    q_path_sub: "这决定了你将获得的指导形式。",
    q_path_opt1: "我寻求遵循祖传世系的设计——传统位置、传统含义",
    q_path_opt2: "我寻求作为个人象征性锚点的设计——意义很重要，但以我的条件",
    q_path_opt3: "我还在学习——指导我，我会倾听",
    q_earth: "你脚下的土地是什么?",
    q_earth_sub: "土问道：你站在什么之上?",
    q_earth_opt1: "我的人民——我愿为之做一切的人",
    q_earth_opt2: "我自己的双手——我所建造的和我所生存的",
    q_earth_opt3: "什么古老的东西——传统、血统、比我更深的根源",
    q_earth_opt4: "说实话，我还在建造中",
    q_water: "在你的表面下流动着什么?",
    q_water_sub: "水问道：你承载着什么别人看不到的?",
    q_water_opt1: "深层直觉——我在事情发生前就感受到它们",
    q_water_opt2: "陈旧的痛苦——我正在学会放下它",
    q_water_opt3: "深沉的爱——比我表现的更深",
    q_water_opt4: "不安——一股将我拉往新地方的潮流",
    q_fire: "你会为什么走过火?",
    q_fire_sub: "火问道：什么让你危险——以最好的方式?",
    q_fire_opt1: "我爱的人——毫不犹豫",
    q_fire_opt2: "我自己的自由——我拒绝被困",
    q_fire_opt3: "我还未建造的东西——只有我能看见的愿景",
    q_fire_opt4: "正义的事——即使代价高昂，我也为之战斗",
    q_air: "闭上眼睛。你看到了什么?",
    q_air_sub: "风问道：你正在追求什么?",
    q_air_opt1: "宁静——经历一切后的平和",
    q_air_opt2: "丰盛——我想生活充满美好",
    q_air_opt3: "联系——被真正看见和深深理解",
    q_air_opt4: "未知——某个我从未去过的地方",
    q_offerings: "将供品放在桌上。",
    q_offerings_sub: "选择2到3个你希望卦象承载的意图。",
    q_balance: "你需要哪个元素更多?",
    q_balance_sub: "不是你是什么——而是缺失的。卦象填补空缺。",
    q_balance_opt1: "土——我需要扎根、根基、我下方坚实的东西",
    q_balance_opt2: "水——我需要再次感受、放下、蜕变",
    q_balance_opt3: "火——我需要勇气、力量、终于行动的意志",
    q_balance_opt4: "风——我需要轻盈、视野、呼吸的空间",
    q_placement: "你感到这属于你身体的哪个位置?",
    q_placement_sub: "点击你愿意的区域。你可以选择多个。",
    q_discretion: "这是否需要保留在你和墨水之间?",
    q_discretion_sub: "没有评判——实际需求决定了正确的选择。",
    q_discretion_opt1: "是的——应该容易隐藏",
    q_discretion_opt2: "有时显露我不在意",
    q_discretion_opt3: "我希望它显眼——这是我的一部分",
    q_collage: "一个卦象，还是多个?",
    q_collage_sub: "许多人多年来建造一个神圣的身体地图。",
    q_collage_opt1: "一个完美的卦象——单一而有意义",
    q_collage_opt2: "开始我的收藏的基础作品",
    q_collage_opt3: "我想要完整的拼贴——我在想大",
    q_collage_opt4: "还不确定——展示什么与我共鸣",
    // Reading
    your_manifestation: "你的显现",
    your_top_yants: "你的顶级卦象",
    tap_details: "点击任何卦象查看完整详情",
    your_offerings: "你的供品",
    explore_library: "探索完整库 →",
    share_reading: "分享你的占卜",
    copied: "✓ 已复制",
    primary_element_is: "你的主要元素是",
    with_strong: "具有强大的",
    influence: "影响力",
    reading_earth: "你扎根了——对重要事物坚定，当世界震动时保持稳定。",
    reading_water: "你流淌深沉——感受、蜕变、承载他人看不见的潮流。",
    reading_fire: "你燃烧——勇气、驱动、拒绝熄灭的火焰。",
    reading_air: "你上升——总是向上看、向外看、向可能的东西看。",
    combo_earth_water: "扎根但流动。你坚守重要的事物，同时放下无益之物。",
    combo_earth_fire: "坚实而凶悍。你以山的力量和信念的热度守护。",
    combo_earth_air: "扎根而开阔。你的根很深，但视野很远。",
    combo_water_fire: "深度遇见驱动。你感受一切并将其引导成不可阻挡的前进。",
    combo_water_air: "直觉而自由。你感受他人遗漏的，追随无人能感受的潮流。",
    combo_fire_air: "明亮燃烧，高远追求。纯粹的雄心被视野和开放性温和。",
    // Library
    reading_complete: "占卜完成",
    your_yant_library: "你的卦象库",
    design_library: "设计库",
    in_collection: "在收藏中",
    total_designs: "总设计数",
    my_journey: "我的旅程",
    view_collection: "查看收藏",
    start_over: "重新开始",
    for_you: "为你",
    all_n_designs: "所有设计",
    cat_all: "所有设计", cat_geometric: "几何", cat_animal: "动物精神", cat_deity: "神灵", cat_nature: "自然",
    click_to_learn: "点击任何设计了解更多 · 使用 + 添加来构建你的收藏",
    in_collection_btn: "✓ 在收藏中", add_btn: "+ 添加",
    // Modal
    placement_label: "位置", energy_label: "能量", visibility_label: "可见性", size_label: "大小",
    vis_hidden: "容易隐藏", vis_semi: "半隐藏", vis_visible: "可见",
    design_word: "设计", collage_note: "拼贴注记",
    see_photos: "查看真实纹身照片 →",
    mark_journey: "标记你的旅程",
    journey_have: "✓ 我有这个", journey_next: "获取下一个", journey_someday: "总有一天",
    remove_collection: "从收藏中删除", add_to_collection: "添加到收藏",
    // Collage
    your_sacred_collection: "你的神圣收藏",
    yants_selected: "已选择的卦象",
    no_designs_yet: "还没有选择设计。返回并选择你的卦象。",
    placement_collage_notes: "位置与拼贴注记",
    the_next_step: "下一步",
    bring_to_master: "把这个占卜带给大师",
    next_step_desc: "你的显现已完成——但卦象不属于你，直到它由合格的阿赞或僧侣给予。分享你的占卜，讨论你的选择，并以敬意和真诚的意图接受祝福。",
    copy_consultation: "复制咨询请求", share_collection: "分享收藏",
    sacred_not_decorative: "圣纹是神圣的——不是装饰性的。",
    seek_legitimate: "在泰国寻求合法的僧侣或阿赞大师。",
    approach_humility: "以谦逊、供品和真诚的意图。",
    meanings_vary: "意义因流派、阿赞和寺庙而异。",
    app_guides: "此应用提供指导——它不声称绝对真理。",
    remove_btn: "删除", view_details: "查看详情", back_to_library: "← 返回库",
    // Journey
    my_sacred_journey: "我的神圣旅程",
    your_sak_yant_plan: "你的圣纹计划",
    received_word: "已获得", planned_word: "已计划", someday_word: "总有一天",
    library_btn: "← 库", collection_btn: "收藏",
    filter_all: "全部", filter_received: "已获得 ✓", filter_next: "获取下一个", filter_someday: "总有一天",
    journey_empty: "你的旅程从这里开始。浏览库并标记你拥有、想要下一个或梦想的卦象。",
    browse_library: "浏览库",
    have_it: "✓ 我有", next_btn: "下一个", someday_btn: "总有一天",
    add_note: "+ 添加个人注记",
    note_placeholder: "添加个人注记——何时获得、谁给的、感受如何...",
    note_save_hint: "按Enter保存 · Shift+Enter新行",
    journey_summary: "旅程总结",
    stat_received: "已获得", stat_getting_next: "获取下一个", stat_someday: "总有一天", stat_total: "计划总数",
    language: "语言",
  },
  ko: {
    // Intro
    sacred_geometry: "신성한 기하학 · 고대의 축복",
    app_title: "삭얀뜨 오라클",
    app_subtitle: "문신 안내 & 디자인 도서관",
    intro_desc: "삭얀뜨는 태국, 캄보디아, 라오스에서 비롯된 신성한 기하학적 문신이며, 승려와 아잔 마스터의 축복을 받아 진정한 영적 무게를 지닙니다.",
    intro_sub: "네 가지 원소를 거치며 걷고 당신의 의도를 드린 후 개인화된 얀뜨의 현현을 받으세요. 이 여정은 약 2분 소요됩니다.",
    begin_reading: "리딩 시작",
    browse_all: "모두 보기",
    designs: "디자인",
    continue_journey: "내 여정 계속",
    yants_word: "얀뜨",
    approach_respect: "존경으로 접근",
    disclaimer: "의미는 계파, 아잔, 사원에 따라 다릅니다. 이 앱은 지침을 제공합니다 — 절대적 선언이 아닙니다. 최종 디자인과 배치는 항상 자격 있는 수행자와 확인하세요.",
    // Elements
    elem_earth: "흙", elem_water: "물", elem_fire: "불", elem_air: "바람",
    elem_earth_desc: "기초 · 뿌리 · 당신이 지키는 것",
    elem_water_desc: "깊이 · 직관 · 당신을 흐르는 것",
    elem_fire_desc: "추진력 · 용기 · 당신 안에서 타오르는 것",
    elem_air_desc: "비전 · 자유 · 당신이 향하는 것",
    // Offerings
    off_protection: "수호", off_fortune: "행운", off_courage: "용기",
    off_love: "사랑과 매력", off_wisdom: "지혜", off_travel: "안전한 여행",
    off_discipline: "규율", off_transformation: "변화", off_success: "성공",
    // Body Areas
    area_upper_back: "상부 등", area_center_back: "등 중앙", area_neck_spine: "목 / 척추",
    area_shoulder: "어깨", area_chest: "가슴", area_upper_arm: "상완",
    area_forearm: "전완", area_thigh: "대퇴", area_calf: "종아리",
    // Quiz Nav
    back: "← 뒤로", continue_btn: "계속 →", reveal_yants: "얀뜨 공개",
    of_word: "의", selected: "선택됨", select_at_least: "최소 선택",
    areas_selected: "영역 선택됨",
    // Questions
    q_path: "어떻게 이 길을 걷고 싶으신가요?",
    q_path_sub: "이것은 받을 지침의 형태를 결정합니다.",
    q_path_opt1: "조상의 계파를 따르는 디자인을 원합니다 — 전통적 배치, 전통적 의미",
    q_path_opt2: "개인적 상징적 앵커로 작용하는 디자인을 원합니다 — 의미는 중요하지만 내 조건으로",
    q_path_opt3: "아직 배우는 중입니다 — 저를 이끌어주세요, 귀를 기울이겠습니다",
    q_earth: "당신 발 아래의 땅은 무엇인가요?",
    q_earth_sub: "흙이 묻습니다: 당신은 무엇 위에 서 있나요?",
    q_earth_opt1: "내 사람들 — 무엇이든 할 수 있는 사람들",
    q_earth_opt2: "내 두 손 — 내가 지은 것과 생존한 것",
    q_earth_opt3: "뭔가 고대의 것 — 전통, 계보, 나보다 더 깊은 뿌리",
    q_earth_opt4: "솔직히 말하면 아직 짓는 중입니다",
    q_water: "당신 표면 아래 무엇이 흐르나요?",
    q_water_sub: "물이 묻습니다: 당신은 다른 사람들이 보지 못하는 것을 무엇을 안고 있나요?",
    q_water_opt1: "깊은 직관 — 일이 일어나기 전에 느낍니다",
    q_water_opt2: "오래된 상처 — 내려놓기를 배우고 있습니다",
    q_water_opt3: "조용한 사랑 — 보이는 것보다 더 깊은",
    q_water_opt4: "불안 — 나를 어딘가 새로운 곳으로 끌어당기는 흐름",
    q_fire: "당신은 무엇을 위해 불을 통해 걸을 수 있나요?",
    q_fire_sub: "불이 묻습니다: 당신을 위험하게 만드는 것은 무엇인가요 — 최고의 방식으로?",
    q_fire_opt1: "내가 사랑하는 사람들 — 망설임 없이",
    q_fire_opt2: "나 자신의 자유 — 갇히기를 거부합니다",
    q_fire_opt3: "아직 짓지 않은 것 — 오직 내가만 볼 수 있는 비전",
    q_fire_opt4: "옳은 것 — 대가가 커도 정의를 위해 싸웁니다",
    q_air: "눈을 감으세요. 무엇이 보이나요?",
    q_air_sub: "바람이 묻습니다: 당신은 무엇을 향하고 있나요?",
    q_air_opt1: "고요함 — 내가 겪은 모든 것 이후의 평화",
    q_air_opt2: "풍요 — 인생이 좋은 것으로 넘치길 원합니다",
    q_air_opt3: "연결 — 진정으로 보여지고 깊이 알려지는 것",
    q_air_opt4: "미지의 것 — 아직 가본 적 없는 곳",
    q_offerings: "테이블에 제물을 올려놓으세요.",
    q_offerings_sub: "당신의 얀뜨가 지니길 원하는 2~3개의 의도를 선택하세요.",
    q_balance: "어느 원소가 더 필요한가요?",
    q_balance_sub: "당신이 무엇인지가 아니라 — 빠진 것. 얀뜨가 공백을 채웁니다.",
    q_balance_opt1: "흙 — 뿌리 내림, 근간, 내 아래 확실한 것이 필요합니다",
    q_balance_opt2: "물 — 다시 느끼고, 내려놓고, 변화하고 싶습니다",
    q_balance_opt3: "불 — 용기, 힘, 마침내 행동할 의지가 필요합니다",
    q_balance_opt4: "바람 — 가벼움, 비전, 숨 쉴 공간이 필요합니다",
    q_placement: "이것이 당신 몸의 어디에 속한다고 느끼나요?",
    q_placement_sub: "열린 영역을 탭하세요. 여러 개를 선택할 수 있습니다.",
    q_discretion: "이것이 당신과 먹물 사이에만 있어야 하나요?",
    q_discretion_sub: "판단 없습니다 — 현실적 필요가 올바른 선택을 결정합니다.",
    q_discretion_opt1: "예 — 숨기기 쉬워야 합니다",
    q_discretion_opt2: "가끔 보여도 상관없습니다",
    q_discretion_opt3: "보이길 원합니다 — 이것이 나의 일부입니다",
    q_collage: "하나의 얀뜨, 아니면 여러 개?",
    q_collage_sub: "많은 사람들이 수년에 걸쳐 신성한 신체 지도를 구축합니다.",
    q_collage_opt1: "하나의 완벽한 얀뜨 — 단수이고 의미 있는",
    q_collage_opt2: "컬렉션을 시작하기 위한 기초 조각",
    q_collage_opt3: "전체 콜라주를 원합니다 — 크게 생각 중입니다",
    q_collage_opt4: "아직 확실하지 않습니다 — 공명하는 것을 보여주세요",
    // Reading
    your_manifestation: "당신의 현현",
    your_top_yants: "당신의 주요 얀뜨",
    tap_details: "얀뜨를 탭하여 전체 세부 정보 보기",
    your_offerings: "당신의 제물",
    explore_library: "전체 도서관 탐색 →",
    share_reading: "당신의 리딩 공유",
    copied: "✓ 복사됨",
    primary_element_is: "당신의 주요 원소는",
    with_strong: "강한",
    influence: "영향력을 갖춘",
    reading_earth: "당신은 뿌리를 내렸습니다 — 중요한 것에 묵직하고, 세상이 흔들려도 안정적입니다.",
    reading_water: "당신은 깊게 흐릅니다 — 느끼고, 변화하고, 다른 사람들이 보지 못하는 흐름을 운반합니다.",
    reading_fire: "당신은 타오릅니다 — 용기, 추진력, 꺼지기를 거부하는 불꽃입니다.",
    reading_air: "당신은 향합니다 — 항상 위로, 바깥으로, 될 수 있는 것을 봅니다.",
    combo_earth_water: "뿌리 내렸지만 흐릅니다. 중요한 것은 붙들고 당신에게 도움이 되지 않는 것은 놓습니다.",
    combo_earth_fire: "견고하고 맹렬합니다. 산의 힘과 신념의 열로 보호합니다.",
    combo_earth_air: "뿌리 내렸지만 확장합니다. 당신의 뿌리는 깊지만 비전은 멀리 갑니다.",
    combo_water_fire: "깊이가 추진력을 만납니다. 모든 것을 느끼고 그것을 멈출 수 없는 전진으로 이끕니다.",
    combo_water_air: "직관적이고 자유롭습니다. 다른 사람들이 놓친 것을 감지하고 누구도 느낄 수 없는 흐름을 따릅니다.",
    combo_fire_air: "밝게 타오르고 높이 향합니다. 순수한 야심이 비전과 개방성으로 완화됩니다.",
    // Library
    reading_complete: "리딩 완료",
    your_yant_library: "당신의 얀뜨 도서관",
    design_library: "디자인 도서관",
    in_collection: "컬렉션에",
    total_designs: "총 디자인",
    my_journey: "내 여정",
    view_collection: "컬렉션 보기",
    start_over: "다시 시작",
    for_you: "당신을 위해",
    all_n_designs: "모든 디자인",
    cat_all: "모든 디자인", cat_geometric: "기하학적", cat_animal: "동물 정신", cat_deity: "신령", cat_nature: "자연",
    click_to_learn: "디자인을 클릭하여 자세히 알아보기 · + 추가를 사용하여 컬렉션 구축",
    in_collection_btn: "✓ 컬렉션에", add_btn: "+ 추가",
    // Modal
    placement_label: "배치", energy_label: "에너지", visibility_label: "가시성", size_label: "크기",
    vis_hidden: "숨기기 쉬움", vis_semi: "부분적 숨김", vis_visible: "보임",
    design_word: "디자인", collage_note: "콜라주 노트",
    see_photos: "실제 문신 사진 보기 →",
    mark_journey: "당신의 여정을 표시",
    journey_have: "✓ 가지고 있음", journey_next: "다음에 얻기", journey_someday: "언젠가",
    remove_collection: "컬렉션에서 제거", add_to_collection: "컬렉션에 추가",
    // Collage
    your_sacred_collection: "당신의 신성한 컬렉션",
    yants_selected: "선택된 얀뜨",
    no_designs_yet: "아직 선택된 디자인이 없습니다. 돌아가 당신의 얀뜨를 선택하세요.",
    placement_collage_notes: "배치 및 콜라주 노트",
    the_next_step: "다음 단계",
    bring_to_master: "이 리딩을 마스터에게 가져가기",
    next_step_desc: "당신의 현현은 완료되었습니다 — 하지만 얀뜨는 자격 있는 아잔이나 승려에게 받을 때까지 당신의 것이 아닙니다. 당신의 리딩을 공유하고, 당신의 선택을 논의하고, 존경과 진정한 의도로 축복을 받으세요.",
    copy_consultation: "상담 요청 복사", share_collection: "컬렉션 공유",
    sacred_not_decorative: "삭얀뜨는 신성합니다 — 장식적이지 않습니다.",
    seek_legitimate: "태국에서 합법적인 승려나 아잔 마스터를 찾으세요.",
    approach_humility: "겸손, 제물, 그리고 진정한 의도로.",
    meanings_vary: "의미는 계파, 아잔, 사원에 따라 다릅니다.",
    app_guides: "이 앱은 지침을 제공합니다 — 절대적 진실을 선언하지 않습니다.",
    remove_btn: "제거", view_details: "세부 정보 보기", back_to_library: "← 도서관으로",
    // Journey
    my_sacred_journey: "내 신성한 여정",
    your_sak_yant_plan: "당신의 삭얀뜨 계획",
    received_word: "받음", planned_word: "계획됨", someday_word: "언젠가",
    library_btn: "← 도서관", collection_btn: "컬렉션",
    filter_all: "모두", filter_received: "받음 ✓", filter_next: "다음에 받기", filter_someday: "언젠가",
    journey_empty: "당신의 여정은 여기서 시작됩니다. 도서관을 둘러보고 가지고 있는, 다음으로 원하는, 또는 꿈꾸는 얀뜨를 표시하세요.",
    browse_library: "도서관 둘러보기",
    have_it: "✓ 가지고 있음", next_btn: "다음", someday_btn: "언젠가",
    add_note: "+ 개인 노트 추가",
    note_placeholder: "개인 노트 추가 — 언제 받았는지, 누가 주었는지, 어떤 기분이었는지...",
    note_save_hint: "Enter를 눌러 저장 · Shift+Enter는 새 줄",
    journey_summary: "여정 요약",
    stat_received: "받음", stat_getting_next: "다음에 받기", stat_someday: "언젠가", stat_total: "계획된 총합",
    language: "언어",
  }
,
  de: {
    // Intro
    sacred_geometry: "Heilige Geometrie · Alter Segen",
    app_title: "Sak Yant Orakel",
    app_subtitle: "Tätowierungs-Führung & Design-Bibliothek",
    intro_desc: "Sak Yants sind heilige geometrische Tätowierungen aus Thailand, Kambodscha und Laos — gesegnet von Mönchen und Ajarn-Meistern, mit echter spiritueller Kraft geladen.",
    intro_sub: "Gehe durch die vier Elemente, bringe deine Absichten dar und empfange deine persönliche Yant-Manifestation. Die Reise dauert etwa zwei Minuten.",
    begin_reading: "Lesung Beginnen",
    browse_all: "Alle Ansehen",
    designs: "Designs",
    continue_journey: "Meine Reise Fortsetzen",
    yants_word: "Yants",
    approach_respect: "Mit Respekt Nähern",
    disclaimer: "Bedeutungen unterscheiden sich nach Linie, Ajarn und Tempel. Diese App leitet an — sie erklärt nicht absolut. Endgültiges Design und Platzierung sollten immer mit einem qualifizierten Praktiker bestätigt werden.",
    // Elements
    elem_earth: "Erde", elem_water: "Wasser", elem_fire: "Feuer", elem_air: "Luft",
    elem_earth_desc: "Fundament · Wurzeln · Das, was du schützt",
    elem_water_desc: "Tiefe · Intuition · Das, was durch dich fließt",
    elem_fire_desc: "Antrieb · Mut · Das, was in dir brennt",
    elem_air_desc: "Vision · Freiheit · Das, worauf du hinarbeitest",
    // Offerings
    off_protection: "Schutz", off_fortune: "Glück", off_courage: "Mut",
    off_love: "Liebe & Ausstrahlung", off_wisdom: "Weisheit", off_travel: "Sichere Reisen",
    off_discipline: "Disziplin", off_transformation: "Umwandlung", off_success: "Erfolg",
    // Body Areas
    area_upper_back: "Oberer Rücken", area_center_back: "Mittlerer Rücken", area_neck_spine: "Nacken / Wirbelsäule",
    area_shoulder: "Schulter", area_chest: "Brust", area_upper_arm: "Oberarm",
    area_forearm: "Unterarm", area_thigh: "Oberschenkel", area_calf: "Wade",
    // Quiz Nav
    back: "← Zurück", continue_btn: "Weiter →", reveal_yants: "Meine Yants Offenbaren",
    of_word: "von", selected: "ausgewählt", select_at_least: "wähle mindestens",
    areas_selected: "Bereiche ausgewählt",
    // Questions
    q_path: "Wie möchtest du diesen Weg gehen?",
    q_path_sub: "Dies prägt die Führung, die du erhältst.",
    q_path_opt1: "Ich suche ein Design, das die ancestrale Linie folgt — traditionelle Platzierung, traditionelle Bedeutung",
    q_path_opt2: "Ich suche ein Design, das als mein persönlicher symbolischer Anker dient — Bedeutung zählt, aber nach meinen Bedingungen",
    q_path_opt3: "Ich lerne noch — führe mich und ich werde hören",
    q_earth: "Was ist der Grund unter deinen Füßen?",
    q_earth_sub: "Erde fragt: Worauf stellst du dich?",
    q_earth_opt1: "Mein Volk — diejenigen, für die ich alles tun würde",
    q_earth_opt2: "Meine eigenen Hände — was ich gebaut und überlebt habe",
    q_earth_opt3: "Etwas Altes — Tradition, Abstammung, Wurzeln tiefer als ich",
    q_earth_opt4: "Ehrlich gesagt? Ich baue sie noch",
    q_water: "Was fließt unter deiner Oberfläche?",
    q_water_sub: "Wasser fragt: Was trägst du, das andere nicht sehen?",
    q_water_opt1: "Eine tiefe Intuition — ich fühle Dinge, bevor sie geschehen",
    q_water_opt2: "Alten Schmerz, den ich lerne loszulassen",
    q_water_opt3: "Eine stille Liebe, die tiefer läuft als ich zeige",
    q_water_opt4: "Unruhe — eine Strömung, die mich irgendwohin zieht",
    q_fire: "Worauf würdest du durchs Feuer gehen?",
    q_fire_sub: "Feuer fragt: Was macht dich gefährlich — auf beste Weise?",
    q_fire_opt1: "Die Menschen, die ich liebe — ohne Zögern",
    q_fire_opt2: "Meine eigene Freiheit — ich weigere mich, eingesperrt zu sein",
    q_fire_opt3: "Etwas, das ich noch nicht gebaut habe — eine Vision nur ich kann sehen",
    q_fire_opt4: "Das Richtige — ich kämpfe für Gerechtigkeit, auch wenn es mich kostet",
    q_air: "Schließe deine Augen. Was siehst du?",
    q_air_sub: "Luft fragt: Worauf arbeitest du hin?",
    q_air_opt1: "Stille — Frieden nach allem, das ich durchlebt habe",
    q_air_opt2: "Überfluss — ich will, dass mein Leben vom Guten überläuft",
    q_air_opt3: "Verbindung — wirklich gesehen und tiefgreifend gekannt werden",
    q_air_opt4: "Das Unbekannte — irgendwohin, wo ich noch nicht war",
    q_offerings: "Lege deine Gaben auf den Tisch.",
    q_offerings_sub: "Wähle 2 oder 3 Absichten, die dein Yant tragen soll.",
    q_balance: "Welches Element brauchst du mehr?",
    q_balance_sub: "Nicht, was du bist — was fehlt. Das Yant füllt die Lücke.",
    q_balance_opt1: "Erde — Ich brauche Halt, Wurzeln, etwas Festes unter mir",
    q_balance_opt2: "Wasser — Ich brauche wieder zu fühlen, loszulassen, mich umzuwandeln",
    q_balance_opt3: "Feuer — Ich brauche Mut, Kraft, den Willen endlich zu handeln",
    q_balance_opt4: "Luft — Ich brauche Leichtigkeit, Vision, Raum zum Atmen",
    q_placement: "Wo auf deinem Körper gehört dies hin?",
    q_placement_sub: "Tippe die Bereiche an, die du offen bist. Du kannst mehrere wählen.",
    q_discretion: "Muss dies zwischen dir und der Tinte bleiben?",
    q_discretion_sub: "Kein Urteil — praktische Bedürfnisse prägen die richtige Wahl.",
    q_discretion_opt1: "Ja — es sollte leicht zu verbergen sein",
    q_discretion_opt2: "Mir ist es recht, wenn es manchmal sichtbar ist",
    q_discretion_opt3: "Ich will, dass es sichtbar ist — das ist Teil von mir",
    q_collage: "Ein Yant oder viele?",
    q_collage_sub: "Viele Menschen bauen über Jahre eine heilige Körperkarte auf.",
    q_collage_opt1: "Ein perfektes Yant — einzigartig und bedeutsam",
    q_collage_opt2: "Ein Grundstück zum Anfang meiner Sammlung",
    q_collage_opt3: "Ich will eine volle Collage — ich denke groß",
    q_collage_opt4: "Noch unsicher — zeige mir, was resoniert",
    // Reading
    your_manifestation: "Deine Manifestation",
    your_top_yants: "Deine Top Yants",
    tap_details: "Tippe ein beliebiges Yant, um vollständige Details zu sehen",
    your_offerings: "Deine Gaben",
    explore_library: "Erkunde vollständige Bibliothek →",
    share_reading: "Teile deine Lesung",
    copied: "✓ Kopiert",
    primary_element_is: "Dein Hauptelement ist",
    with_strong: "mit starkem",
    influence: "Einfluss",
    reading_earth: "Du bist verwurzelt — gefestigt in dem, was zählt, stabil wenn die Welt bebt.",
    reading_water: "Du fließt tief — fühlend, umwandelnd, Strömungen tragend, die andere nicht sehen.",
    reading_fire: "Du brennst — Mut, Antrieb, eine Flamme, die sich weigert auszugehen.",
    reading_air: "Du arbeitest hin — immer aufwärts schauend, hinaus, zu dem, was sein könnte.",
    combo_earth_water: "Verwurzelt doch fließend. Du hältst fest an dem, was zählt, während du loslässt, was dir nicht dient.",
    combo_earth_fire: "Fest und wild. Du schützt mit der Kraft der Berge und der Hitze der Überzeugung.",
    combo_earth_air: "Geerdet doch expansiv. Deine Wurzeln gehen tief, aber deine Vision reicht weit.",
    combo_water_fire: "Tiefe trifft Antrieb. Du fühlst alles und leitest es in unaufhaltsame Vorwärtsbewegung.",
    combo_water_air: "Intuitiv und frei. Du spürst, was andere vermissen, und folgst Strömungen, die niemand sonst fühlt.",
    combo_fire_air: "Brennend hell und hoch erreichend. Reine Ehrgeiz gemildert durch Vision und Offenheit.",
    // Library
    reading_complete: "Lesung Abgeschlossen",
    your_yant_library: "Deine Yant-Bibliothek",
    design_library: "Design-Bibliothek",
    in_collection: "in Sammlung",
    total_designs: "Gesamtdesigns",
    my_journey: "Meine Reise",
    view_collection: "Sammlung Ansehen",
    start_over: "Von Vorne Anfangen",
    for_you: "Für Dich",
    all_n_designs: "Alle Designs",
    cat_all: "Alle Designs", cat_geometric: "Geometrisch", cat_animal: "Tiergötter", cat_deity: "Gottheiten", cat_nature: "Natur",
    click_to_learn: "Klicke ein beliebiges Design zum Lernen · Benutze + Hinzufügen um deine Sammlung aufzubauen",
    in_collection_btn: "✓ In Sammlung", add_btn: "+ Hinzufügen",
    // Modal
    placement_label: "Platzierung", energy_label: "Energie", visibility_label: "Sichtbarkeit", size_label: "Größe",
    vis_hidden: "Leicht zu verbergen", vis_semi: "Halb verborgen", vis_visible: "Sichtbar",
    design_word: "Design", collage_note: "Collage-Notiz",
    see_photos: "Echte Tätowierungs-Fotos Ansehen →",
    mark_journey: "Markiere deine Reise",
    journey_have: "✓ Ich Habe Dies", journey_next: "Nächstes", journey_someday: "Eines Tages",
    remove_collection: "Aus Sammlung Entfernen", add_to_collection: "Zu Sammlung Hinzufügen",
    // Collage
    your_sacred_collection: "Deine Heilige Sammlung",
    yants_selected: "Yants Ausgewählt",
    no_designs_yet: "Noch keine Designs ausgewählt. Gehe zurück und wähle deine Yants.",
    placement_collage_notes: "Platzierungs- & Collage-Notizen",
    the_next_step: "Der Nächste Schritt",
    bring_to_master: "Bringe diese Lesung zu einem Meister",
    next_step_desc: "Deine Manifestation ist abgeschlossen — aber das Yant ist nicht dein, bis es von einem qualifizierten Ajarn oder Mönch gegeben wird. Teile deine Lesung, bespreche deine Wahl, und empfange den Segen mit Respekt und Absicht.",
    copy_consultation: "Kopiere Beratungsanfrage", share_collection: "Teile Sammlung",
    sacred_not_decorative: "Sak Yants sind heilig — nicht dekorativ.",
    seek_legitimate: "Suche einen legitimen Mönch oder Ajarn-Meister in Thailand.",
    approach_humility: "Mit Demut, Gaben und aufrichtiger Absicht nähern.",
    meanings_vary: "Bedeutungen unterscheiden sich nach Linie, Ajarn und Tempel.",
    app_guides: "Diese App leitet an — sie erklärt nicht absolute Wahrheit.",
    remove_btn: "Entfernen", view_details: "Details Ansehen", back_to_library: "← Zurück zur Bibliothek",
    // Journey
    my_sacred_journey: "Meine Heilige Reise",
    your_sak_yant_plan: "Dein Sak Yant Plan",
    received_word: "erhalten", planned_word: "geplant", someday_word: "eines Tages",
    library_btn: "← Bibliothek", collection_btn: "Sammlung",
    filter_all: "Alle", filter_received: "Erhalten ✓", filter_next: "Nächstes", filter_someday: "Eines Tages",
    journey_empty: "Deine Reise beginnt hier. Durchsuche die Bibliothek und markiere Yants, die du hast, die nächsten brauchst, oder erträumst.",
    browse_library: "Bibliothek Durchsuchen",
    have_it: "✓ Habe Es", next_btn: "Nächstes", someday_btn: "Eines Tages",
    add_note: "+ Füge eine persönliche Notiz hinzu",
    note_placeholder: "Füge eine persönliche Notiz hinzu — wann du es bekamst, wer es dir gab, wie es sich anfühlte...",
    note_save_hint: "Drücke Enter zum Speichern · Shift+Enter für neue Zeile",
    journey_summary: "Reise Zusammenfassung",
    stat_received: "Erhalten", stat_getting_next: "Nächstes", stat_someday: "Eines Tages", stat_total: "Gesamt Geplant",
    language: "Sprache",
  },
  fr: {
    // Intro
    sacred_geometry: "Géométrie Sacrée · Bénédiction Ancienne",
    app_title: "Oracle Sak Yant",
    app_subtitle: "Guidance de Tatouage & Bibliothèque de Designs",
    intro_desc: "Les sak yants sont des tatouages géométriques sacrés de Thaïlande, Cambodge et Laos — bénis par des moines et maîtres ajarn, porteurs d'un vrai poids spirituel.",
    intro_sub: "Traversez les quatre éléments, offrez vos intentions et recevez votre manifestation yant personnalisée. Le voyage dure environ deux minutes.",
    begin_reading: "Commencer la Lecture",
    browse_all: "Voir Tous",
    designs: "Designs",
    continue_journey: "Continuer Mon Voyage",
    yants_word: "yants",
    approach_respect: "Approchez avec Respect",
    disclaimer: "Les significations varient selon la lignée, l'ajarn et le temple. Cette application guide — elle ne déclare pas. Le design et placement final devraient toujours être confirmés avec un praticien qualifié.",
    // Elements
    elem_earth: "Terre", elem_water: "Eau", elem_fire: "Feu", elem_air: "Air",
    elem_earth_desc: "Fondation · Racines · Ce que tu protèges",
    elem_water_desc: "Profondeur · Intuition · Ce qui coule à travers toi",
    elem_fire_desc: "Impulsion · Courage · Ce qui brûle en toi",
    elem_air_desc: "Vision · Liberté · Ce vers quoi tu te diriges",
    // Offerings
    off_protection: "Protection", off_fortune: "Bonne Fortune", off_courage: "Courage",
    off_love: "Amour & Charisme", off_wisdom: "Sagesse", off_travel: "Voyages Sûrs",
    off_discipline: "Discipline", off_transformation: "Transformation", off_success: "Succès",
    // Body Areas
    area_upper_back: "Haut du Dos", area_center_back: "Milieu du Dos", area_neck_spine: "Cou / Épine Dorsale",
    area_shoulder: "Épaule", area_chest: "Poitrine", area_upper_arm: "Biceps",
    area_forearm: "Avant-bras", area_thigh: "Cuisse", area_calf: "Mollet",
    // Quiz Nav
    back: "← Retour", continue_btn: "Continuer →", reveal_yants: "Révélez Mes Yants",
    of_word: "de", selected: "sélectionné", select_at_least: "sélectionner au moins",
    areas_selected: "zone(s) sélectionnée(s)",
    // Questions
    q_path: "Comment veux-tu marcher ce chemin?",
    q_path_sub: "Cela façonne la guidance que tu recevras.",
    q_path_opt1: "Je cherche un design qui suit la lignée ancestrale — placement traditionnel, signification traditionnelle",
    q_path_opt2: "Je cherche un design qui serve comme ancre symbolique personnelle — la signification compte, mais à mes conditions",
    q_path_opt3: "J'apprends encore — guide-moi et j'écouterai",
    q_earth: "Quel est le sol sous tes pieds?",
    q_earth_sub: "La Terre demande: sur quoi tu te tiens?",
    q_earth_opt1: "Mon peuple — ceux pour qui je ferais n'importe quoi",
    q_earth_opt2: "Mes propres mains — ce que j'ai bâti et ce que j'ai survécu",
    q_earth_opt3: "Quelque chose d'ancien — tradition, lignée, racines plus profondes que moi",
    q_earth_opt4: "Honnêtement? Je la construis encore",
    q_water: "Qu'est-ce qui coule sous ta surface?",
    q_water_sub: "L'Eau demande: qu'est-ce que tu portes que les autres ne voient pas?",
    q_water_opt1: "Une profonde intuition — je sens les choses avant qu'elles n'arrivent",
    q_water_opt2: "Une ancienne douleur que j'apprends à lâcher prise",
    q_water_opt3: "Un amour tranquille qui court plus profond que je ne le montre",
    q_water_opt4: "Une agitation — un courant me tirant quelque part de nouveau",
    q_fire: "Pour quoi marche-tu au travers du feu?",
    q_fire_sub: "Le Feu demande: qu'est-ce qui te rend dangereux — de la meilleure façon?",
    q_fire_opt1: "Les gens que j'aime — sans hésitation",
    q_fire_opt2: "Ma propre liberté — je refuse d'être enfermé",
    q_fire_opt3: "Quelque chose que je n'ai pas encore bâti — une vision que seul moi peux voir",
    q_fire_opt4: "Ce qui est juste — je lutte pour la justice même si cela me coûte",
    q_air: "Ferme les yeux. Que vois-tu?",
    q_air_sub: "L'Air demande: vers quoi te diriges-tu?",
    q_air_opt1: "Calme — paix après tout ce que j'ai traversé",
    q_air_opt2: "Abondance — je veux que la vie déborde de bonnes choses",
    q_air_opt3: "Connexion — être vraiment vu et profondément connu",
    q_air_opt4: "L'inconnu — quelque part où je n'ai jamais été",
    q_offerings: "Place tes offrandes sur la table.",
    q_offerings_sub: "Choisis 2 ou 3 intentions que ton yant portera.",
    q_balance: "Quel élément as-tu besoin de plus?",
    q_balance_sub: "Pas ce que tu es — ce qui manque. Le yant remplit le vide.",
    q_balance_opt1: "Terre — J'ai besoin d'ancrage, de racines, quelque chose de solide sous moi",
    q_balance_opt2: "Eau — J'ai besoin de sentir à nouveau, de lâcher prise, de me transformer",
    q_balance_opt3: "Feu — J'ai besoin de courage, de pouvoir, de la volonté d'enfin agir",
    q_balance_opt4: "Air — J'ai besoin de légèreté, de vision, d'espace pour respirer",
    q_placement: "Où sur ton corps cela-t-il appartient?",
    q_placement_sub: "Tape les zones que tu es ouvert à. Tu peux en sélectionner plusieurs.",
    q_discretion: "Cela doit-il rester entre toi et l'encre?",
    q_discretion_sub: "Aucun jugement — les besoins pratiques façonnent le bon choix.",
    q_discretion_opt1: "Oui — cela devrait être facile à cacher",
    q_discretion_opt2: "Ça ne me dérange pas qu'il soit visible parfois",
    q_discretion_opt3: "Je veux qu'il soit visible — c'est une partie de qui je suis",
    q_collage: "Un yant, ou plusieurs?",
    q_collage_sub: "Beaucoup de gens construisent une carte du corps sacré au fil des ans.",
    q_collage_opt1: "Un yant parfait — unique et significatif",
    q_collage_opt2: "Une pièce de base pour commencer ma collection",
    q_collage_opt3: "Je veux un collage complet — je pense grand",
    q_collage_opt4: "Pas sûr encore — montre-moi ce qui résonne",
    // Reading
    your_manifestation: "Ta Manifestation",
    your_top_yants: "Tes Meilleurs Yants",
    tap_details: "Tape n'importe quel yant pour voir les détails complets",
    your_offerings: "Tes Offrandes",
    explore_library: "Explorer la Bibliothèque Complète →",
    share_reading: "Partage ta Lecture",
    copied: "✓ Copié",
    primary_element_is: "Ton élément principal est",
    with_strong: "avec une forte",
    influence: "influence",
    reading_earth: "Tu es enraciné — ancré dans ce qui compte, stable quand le monde tremble.",
    reading_water: "Tu coules profondément — sentant, transformant, portant des courants que les autres ne voient pas.",
    reading_fire: "Tu brûles — courage, impulsion, une flamme qui refuse de s'éteindre.",
    reading_air: "Tu te diriges — toujours regardant vers le haut, vers l'extérieur, vers ce qui pourrait être.",
    combo_earth_water: "Enraciné mais fluide. Tu t'accroches à ce qui compte tout en lâchant ce qui ne te sert pas.",
    combo_earth_fire: "Solide et féroce. Tu protèges avec la force des montagnes et la chaleur de la conviction.",
    combo_earth_air: "Ancré mais expansif. Tes racines plongent profond mais ta vision s'étend loin.",
    combo_water_fire: "La profondeur rencontre l'impulsion. Tu sens tout et le canalises dans un mouvement irrésistible vers l'avant.",
    combo_water_air: "Intuitif et libre. Tu sens ce que les autres manquent et suis des courants que personne d'autre ne peut sentir.",
    combo_fire_air: "Brûlant brillant et atteignant haut. Ambition pure tempérée par la vision et l'ouverture.",
    // Library
    reading_complete: "Lecture Complète",
    your_yant_library: "Ta Bibliothèque Yant",
    design_library: "Bibliothèque de Designs",
    in_collection: "en collection",
    total_designs: "designs totaux",
    my_journey: "Mon Voyage",
    view_collection: "Voir Collection",
    start_over: "Recommencer",
    for_you: "Pour Toi",
    all_n_designs: "Tous les Designs",
    cat_all: "Tous les Designs", cat_geometric: "Géométrique", cat_animal: "Esprits Animaux", cat_deity: "Divinités", cat_nature: "Nature",
    click_to_learn: "Clique sur n'importe quel design pour en savoir plus · Utilise + Ajouter pour construire ta collection",
    in_collection_btn: "✓ En Collection", add_btn: "+ Ajouter",
    // Modal
    placement_label: "Placement", energy_label: "Énergie", visibility_label: "Visibilité", size_label: "Taille",
    vis_hidden: "Facile à cacher", vis_semi: "Semi-caché", vis_visible: "Visible",
    design_word: "design", collage_note: "Note Collage",
    see_photos: "Voir Photos de Vrais Tatouages →",
    mark_journey: "Marque Ton Voyage",
    journey_have: "✓ J'ai Ceci", journey_next: "Prochain", journey_someday: "Un Jour",
    remove_collection: "Retirer de la Collection", add_to_collection: "Ajouter à la Collection",
    // Collage
    your_sacred_collection: "Ta Collection Sacrée",
    yants_selected: "Yants Sélectionnés",
    no_designs_yet: "Aucun design sélectionné encore. Retourne en arrière et choisis tes yants.",
    placement_collage_notes: "Notes de Placement & Collage",
    the_next_step: "La Prochaine Étape",
    bring_to_master: "Apporte cette Lecture à un Maître",
    next_step_desc: "Ta manifestation est complète — mais le yant ne t'appartient pas jusqu'à ce qu'il te soit donné par un ajarn qualifié ou un moine. Partage ta lecture, discute de tes choix, et reçois la bénédiction avec respect et intention.",
    copy_consultation: "Copie Demande de Consultation", share_collection: "Partage Collection",
    sacred_not_decorative: "Les sak yants sont sacrés — pas décoratifs.",
    seek_legitimate: "Cherche un véritable moine ou maître ajarn en Thaïlande.",
    approach_humility: "Approche avec humilité, offrandes et intention sincère.",
    meanings_vary: "Les significations varient selon la lignée, l'ajarn et le temple.",
    app_guides: "Cette application guide — elle ne déclare pas la vérité absolue.",
    remove_btn: "Retirer", view_details: "Voir Détails", back_to_library: "← Retour à la Bibliothèque",
    // Journey
    my_sacred_journey: "Mon Voyage Sacré",
    your_sak_yant_plan: "Ton Plan Sak Yant",
    received_word: "reçu", planned_word: "planifié", someday_word: "un jour",
    library_btn: "← Bibliothèque", collection_btn: "Collection",
    filter_all: "Tous", filter_received: "Reçu ✓", filter_next: "Prochain", filter_someday: "Un Jour",
    journey_empty: "Ton voyage commence ici. Explore la bibliothèque et marque les yants que tu as, que tu veux ensuite, ou dont tu rêves.",
    browse_library: "Explorer Bibliothèque",
    have_it: "✓ Je l'Ai", next_btn: "Prochain", someday_btn: "Un Jour",
    add_note: "+ Ajoute une note personnelle",
    note_placeholder: "Ajoute une note personnelle — quand tu l'as reçu, qui te l'a donné, comment ça t'a fait sentir...",
    note_save_hint: "Appuie sur Entrée pour sauvegarder · Shift+Entrée pour nouvelle ligne",
    journey_summary: "Résumé du Voyage",
    stat_received: "Reçu", stat_getting_next: "Prochain", stat_someday: "Un Jour", stat_total: "Total Planifié",
    language: "Langue",
  },
  es: {
    // Intro
    sacred_geometry: "Geometría Sagrada · Bendición Antigua",
    app_title: "Oráculo Sak Yant",
    app_subtitle: "Guía de Tatuaje & Biblioteca de Diseños",
    intro_desc: "Los sak yants son tatuajes geométricos sagrados de Tailandia, Camboya y Laos — bendecidos por monjes y maestros ajarn, cargados de verdadero peso espiritual.",
    intro_sub: "Atraviesa los cuatro elementos, ofrece tus intenciones y recibe tu manifestación yant personalizada. El viaje dura aproximadamente dos minutos.",
    begin_reading: "Comenzar la Lectura",
    browse_all: "Ver Todos",
    designs: "Diseños",
    continue_journey: "Continuar Mi Viaje",
    yants_word: "yants",
    approach_respect: "Acércate con Respeto",
    disclaimer: "Los significados varían según el linaje, ajarn y templo. Esta aplicación guía — no declara. El diseño y colocación final siempre deben confirmarse con un practicante calificado.",
    // Elements
    elem_earth: "Tierra", elem_water: "Agua", elem_fire: "Fuego", elem_air: "Aire",
    elem_earth_desc: "Fundación · Raíces · Lo que proteges",
    elem_water_desc: "Profundidad · Intuición · Lo que fluye a través de ti",
    elem_fire_desc: "Impulso · Valentía · Lo que arde en ti",
    elem_air_desc: "Visión · Libertad · Lo que persigues",
    // Offerings
    off_protection: "Protección", off_fortune: "Buena Fortuna", off_courage: "Valentía",
    off_love: "Amor & Carisma", off_wisdom: "Sabiduría", off_travel: "Viajes Seguros",
    off_discipline: "Disciplina", off_transformation: "Transformación", off_success: "Éxito",
    // Body Areas
    area_upper_back: "Parte Superior de la Espalda", area_center_back: "Centro de la Espalda", area_neck_spine: "Cuello / Espina Dorsal",
    area_shoulder: "Hombro", area_chest: "Pecho", area_upper_arm: "Brazo Superior",
    area_forearm: "Antebrazo", area_thigh: "Muslo", area_calf: "Pantorrilla",
    // Quiz Nav
    back: "← Atrás", continue_btn: "Continuar →", reveal_yants: "Revelar Mis Yants",
    of_word: "de", selected: "seleccionado", select_at_least: "selecciona al menos",
    areas_selected: "área(s) seleccionada(s)",
    // Questions
    q_path: "¿Cómo quieres caminar este camino?",
    q_path_sub: "Esto forma la guía que recibirás.",
    q_path_opt1: "Busco un diseño que siga el linaje ancestral — colocación tradicional, significado tradicional",
    q_path_opt2: "Busco un diseño que sirva como ancla simbólica personal — la significación importa, pero en mis términos",
    q_path_opt3: "Aún estoy aprendiendo — guíame y escucharé",
    q_earth: "¿Cuál es el terreno bajo tus pies?",
    q_earth_sub: "La Tierra pregunta: ¿en qué te apoyas?",
    q_earth_opt1: "Mi gente — aquellos por quienes haría cualquier cosa",
    q_earth_opt2: "Mis propias manos — lo que he construido y lo que he sobrevivido",
    q_earth_opt3: "Algo antiguo — tradición, linaje, raíces más profundas que yo",
    q_earth_opt4: "Honestamente? Aún la estoy construyendo",
    q_water: "¿Qué corre bajo tu superficie?",
    q_water_sub: "El Agua pregunta: ¿qué cargas que otros no ven?",
    q_water_opt1: "Una profunda intuición — siento cosas antes de que ocurran",
    q_water_opt2: "Viejo dolor que estoy aprendiendo a soltar",
    q_water_opt3: "Un amor tranquilo que corre más profundo que lo que muestro",
    q_water_opt4: "Inquietud — una corriente que me arrastra hacia algún lugar nuevo",
    q_fire: "¿Por qué cruzarías el fuego?",
    q_fire_sub: "El Fuego pregunta: ¿qué te hace peligroso — de la mejor manera?",
    q_fire_opt1: "La gente que amo — sin dudar",
    q_fire_opt2: "Mi propia libertad — me niego a estar encerrado",
    q_fire_opt3: "Algo que aún no he construido — una visión que solo yo puedo ver",
    q_fire_opt4: "Lo correcto — lucho por la justicia incluso si me cuesta",
    q_air: "Cierra los ojos. ¿Qué ves?",
    q_air_sub: "El Aire pregunta: ¿hacia qué te diriges?",
    q_air_opt1: "Quietud — paz después de todo por lo que he pasado",
    q_air_opt2: "Abundancia — quiero que la vida rebose de cosas buenas",
    q_air_opt3: "Conexión — ser verdaderamente visto y profundamente conocido",
    q_air_opt4: "Lo desconocido — algún lugar donde nunca he estado",
    q_offerings: "Coloca tus ofrendas en la mesa.",
    q_offerings_sub: "Elige 2 o 3 intenciones que tu yant llevará.",
    q_balance: "¿Qué elemento necesitas más?",
    q_balance_sub: "No lo que eres — lo que falta. El yant llena el vacío.",
    q_balance_opt1: "Tierra — Necesito arraigo, raíces, algo sólido bajo mí",
    q_balance_opt2: "Agua — Necesito sentir de nuevo, soltar, transformarme",
    q_balance_opt3: "Fuego — Necesito valentía, poder, la voluntad de finalmente actuar",
    q_balance_opt4: "Aire — Necesito ligereza, visión, espacio para respirar",
    q_placement: "¿Dónde en tu cuerpo sientes que pertenece?",
    q_placement_sub: "Toca las áreas que estás abierto a. Puedes seleccionar múltiples.",
    q_discretion: "¿Necesita permanecer entre tú y la tinta?",
    q_discretion_sub: "Sin juicio — las necesidades prácticas moldean la opción correcta.",
    q_discretion_opt1: "Sí — debería ser fácil de ocultar",
    q_discretion_opt2: "No me importa que se vea a veces",
    q_discretion_opt3: "Quiero que sea visible — esto es parte de quién soy",
    q_collage: "¿Un yant, o muchos?",
    q_collage_sub: "Muchas personas construyen un mapa del cuerpo sagrado a lo largo de los años.",
    q_collage_opt1: "Un yant perfecto — único y significativo",
    q_collage_opt2: "Una pieza de base para comenzar mi colección",
    q_collage_opt3: "Quiero un collage completo — estoy pensando en grande",
    q_collage_opt4: "Aún no estoy seguro — muéstrame qué resuena",
    // Reading
    your_manifestation: "Tu Manifestación",
    your_top_yants: "Tus Mejores Yants",
    tap_details: "Toca cualquier yant para ver detalles completos",
    your_offerings: "Tus Ofrendas",
    explore_library: "Explorar Biblioteca Completa →",
    share_reading: "Comparte Tu Lectura",
    copied: "✓ Copiado",
    primary_element_is: "Tu elemento principal es",
    with_strong: "con fuerte",
    influence: "influencia",
    reading_earth: "Estás arraigado — ancado en lo que importa, firme cuando el mundo tiembla.",
    reading_water: "Fluyes profundamente — sintiendo, transformando, llevando corrientes que otros no ven.",
    reading_fire: "Arde — valentía, impulso, una llama que se niega a apagarse.",
    reading_air: "Te diriges — siempre mirando hacia arriba, hacia afuera, hacia lo que podría ser.",
    combo_earth_water: "Arraigado pero fluido. Mantente firme en lo que importa mientras sueltas lo que no te sirve.",
    combo_earth_fire: "Sólido y feroz. Proteges con la fuerza de las montañas y el calor de la convicción.",
    combo_earth_air: "Arraigado pero expansivo. Tus raíces van profundas pero tu visión alcanza lejos.",
    combo_water_fire: "La profundidad se encuentra con el impulso. Sientes todo y lo canalizas en movimiento irrésistible hacia adelante.",
    combo_water_air: "Intuitivo y libre. Sientes lo que otros pierden y sigues corrientes que nadie más puede sentir.",
    combo_fire_air: "Ardiente y brillante y alcanzando alto. Ambición pura temperada por visión y apertura.",
    // Library
    reading_complete: "Lectura Completada",
    your_yant_library: "Tu Biblioteca Yant",
    design_library: "Biblioteca de Diseños",
    in_collection: "en colección",
    total_designs: "diseños totales",
    my_journey: "Mi Viaje",
    view_collection: "Ver Colección",
    start_over: "Comenzar de Nuevo",
    for_you: "Para Ti",
    all_n_designs: "Todos los Diseños",
    cat_all: "Todos los Diseños", cat_geometric: "Geométrico", cat_animal: "Espíritus Animales", cat_deity: "Deidades", cat_nature: "Naturaleza",
    click_to_learn: "Haz clic en cualquier diseño para aprender más · Usa + Agregar para construir tu colección",
    in_collection_btn: "✓ En Colección", add_btn: "+ Agregar",
    // Modal
    placement_label: "Colocación", energy_label: "Energía", visibility_label: "Visibilidad", size_label: "Tamaño",
    vis_hidden: "Fácil de ocultar", vis_semi: "Semi-oculto", vis_visible: "Visible",
    design_word: "diseño", collage_note: "Nota del Collage",
    see_photos: "Ver Fotos de Tatuajes Reales →",
    mark_journey: "Marca Tu Viaje",
    journey_have: "✓ Tengo Esto", journey_next: "Próximo", journey_someday: "Algún Día",
    remove_collection: "Remover de la Colección", add_to_collection: "Agregar a la Colección",
    // Collage
    your_sacred_collection: "Tu Colección Sagrada",
    yants_selected: "Yants Seleccionados",
    no_designs_yet: "Sin diseños seleccionados aún. Vuelve atrás y elige tus yants.",
    placement_collage_notes: "Notas de Colocación & Collage",
    the_next_step: "El Siguiente Paso",
    bring_to_master: "Lleva Esta Lectura a un Maestro",
    next_step_desc: "Tu manifestación está completa — pero el yant no es tuyo hasta que te lo dé un ajarn calificado o un monje. Comparte tu lectura, discute tus elecciones y recibe la bendición con respeto e intención.",
    copy_consultation: "Copiar Solicitud de Consulta", share_collection: "Compartir Colección",
    sacred_not_decorative: "Los sak yants son sagrados — no decorativos.",
    seek_legitimate: "Busca un monje legítimo o maestro ajarn en Tailandia.",
    approach_humility: "Acércate con humildad, ofrendas e intención sincera.",
    meanings_vary: "Los significados varían según el linaje, ajarn y templo.",
    app_guides: "Esta aplicación guía — no declara la verdad absoluta.",
    remove_btn: "Remover", view_details: "Ver Detalles", back_to_library: "← Volver a la Biblioteca",
    // Journey
    my_sacred_journey: "Mi Viaje Sagrado",
    your_sak_yant_plan: "Tu Plan Sak Yant",
    received_word: "recibido", planned_word: "planeado", someday_word: "algún día",
    library_btn: "← Biblioteca", collection_btn: "Colección",
    filter_all: "Todos", filter_received: "Recibido ✓", filter_next: "Próximo", filter_someday: "Algún Día",
    journey_empty: "Tu viaje comienza aquí. Explora la biblioteca y marca yants que tienes, quieres después, o de los que sueñas.",
    browse_library: "Explorar Biblioteca",
    have_it: "✓ Tengo", next_btn: "Próximo", someday_btn: "Algún Día",
    add_note: "+ Agrega una nota personal",
    note_placeholder: "Agrega una nota personal — cuándo lo recibiste, quién te lo dio, cómo se sintió...",
    note_save_hint: "Presiona Enter para guardar · Shift+Enter para nueva línea",
    journey_summary: "Resumen del Viaje",
    stat_received: "Recibido", stat_getting_next: "Próximo", stat_someday: "Algún Día", stat_total: "Total Planeado",
    language: "Idioma",
  },
  pt: {
    // Intro
    sacred_geometry: "Geometria Sagrada · Bênção Antiga",
    app_title: "Oráculo Sak Yant",
    app_subtitle: "Orientação de Tatuagem & Biblioteca de Designs",
    intro_desc: "Sak yants são tatuagens geométricas sagradas da Tailândia, Camboja e Laos — abençoadas por monges e mestres ajarn, carregadas de verdadeiro peso espiritual.",
    intro_sub: "Atravesse os quatro elementos, ofereça suas intenções e receba sua manifestação yant personalizada. A jornada leva cerca de dois minutos.",
    begin_reading: "Começar a Leitura",
    browse_all: "Ver Todos",
    designs: "Designs",
    continue_journey: "Continuar Minha Jornada",
    yants_word: "yants",
    approach_respect: "Aproxime-se com Respeito",
    disclaimer: "Os significados variam por linhagem, ajarn e templo. Este aplicativo orienta — não declara. O design e colocação final devem sempre ser confirmados com um praticante qualificado.",
    // Elements
    elem_earth: "Terra", elem_water: "Água", elem_fire: "Fogo", elem_air: "Ar",
    elem_earth_desc: "Fundação · Raízes · O que você protege",
    elem_water_desc: "Profundidade · Intuição · O que flui através de você",
    elem_fire_desc: "Impulso · Coragem · O que queima em você",
    elem_air_desc: "Visão · Liberdade · O que você busca",
    // Offerings
    off_protection: "Proteção", off_fortune: "Boa Sorte", off_courage: "Coragem",
    off_love: "Amor & Carisma", off_wisdom: "Sabedoria", off_travel: "Viagens Seguras",
    off_discipline: "Disciplina", off_transformation: "Transformação", off_success: "Sucesso",
    // Body Areas
    area_upper_back: "Parte Superior das Costas", area_center_back: "Centro das Costas", area_neck_spine: "Pescoço / Coluna Vertebral",
    area_shoulder: "Ombro", area_chest: "Peito", area_upper_arm: "Braço Superior",
    area_forearm: "Antebraço", area_thigh: "Coxa", area_calf: "Panturrilha",
    // Quiz Nav
    back: "← Voltar", continue_btn: "Continuar →", reveal_yants: "Revelar Meus Yants",
    of_word: "de", selected: "selecionado", select_at_least: "selecione pelo menos",
    areas_selected: "área(s) selecionada(s)",
    // Questions
    q_path: "Como você quer caminhar este caminho?",
    q_path_sub: "Isto molda a orientação que você receberá.",
    q_path_opt1: "Busco um design que siga a linhagem ancestral — colocação tradicional, significado tradicional",
    q_path_opt2: "Busco um design que sirva como âncora simbólica pessoal — o significado importa, mas nos meus termos",
    q_path_opt3: "Ainda estou aprendendo — oriente-me e escutarei",
    q_earth: "Qual é o solo sob seus pés?",
    q_earth_sub: "A Terra pergunta: em que você se apoia?",
    q_earth_opt1: "Meu povo — aqueles pelos quais faria qualquer coisa",
    q_earth_opt2: "Minhas próprias mãos — o que construí e o que sobrevivi",
    q_earth_opt3: "Algo antigo — tradição, linhagem, raízes mais profundas que eu",
    q_earth_opt4: "Honestamente? Ainda estou construindo",
    q_water: "O que flui sob sua superfície?",
    q_water_sub: "A Água pergunta: o que você carrega que outros não veem?",
    q_water_opt1: "Uma intuição profunda — sinto coisas antes de acontecerem",
    q_water_opt2: "Dor antiga que estou aprendendo a soltar",
    q_water_opt3: "Um amor tranquilo que corre mais profundo que mostro",
    q_water_opt4: "Inquietação — uma corrente me puxando para algum lugar novo",
    q_fire: "Por que você atravessaria o fogo?",
    q_fire_sub: "O Fogo pergunta: o que te torna perigoso — da melhor forma?",
    q_fire_opt1: "As pessoas que amo — sem hesitação",
    q_fire_opt2: "Minha própria liberdade — recuso-me a ser aprisionado",
    q_fire_opt3: "Algo que ainda não construí — uma visão apenas eu posso ver",
    q_fire_opt4: "O que é certo — luto pela justiça mesmo se me custar",
    q_air: "Feche os olhos. O que você vê?",
    q_air_sub: "O Ar pergunta: para o que você está se dirigindo?",
    q_air_opt1: "Quietude — paz depois de tudo que passei",
    q_air_opt2: "Abundância — quero que a vida transborde de coisas boas",
    q_air_opt3: "Conexão — ser verdadeiramente visto e profundamente conhecido",
    q_air_opt4: "O desconhecido — algum lugar onde nunca estive",
    q_offerings: "Coloque suas oferendas na mesa.",
    q_offerings_sub: "Escolha 2 ou 3 intenções que seu yant carregará.",
    q_balance: "Qual elemento você precisa mais?",
    q_balance_sub: "Não o que você é — o que falta. O yant preenche a lacuna.",
    q_balance_opt1: "Terra — Preciso de raiz, fundação, algo sólido sob mim",
    q_balance_opt2: "Água — Preciso sentir novamente, soltar, me transformar",
    q_balance_opt3: "Fogo — Preciso de coragem, poder, a vontade de finalmente agir",
    q_balance_opt4: "Ar — Preciso de leveza, visão, espaço para respirar",
    q_placement: "Onde em seu corpo você sente que pertence?",
    q_placement_sub: "Toque as áreas que você está aberto. Você pode selecionar várias.",
    q_discretion: "Isso precisa ficar entre você e a tinta?",
    q_discretion_sub: "Sem julgamento — necessidades práticas moldam a escolha certa.",
    q_discretion_opt1: "Sim — deveria ser fácil de esconder",
    q_discretion_opt2: "Não me importa se fica visível às vezes",
    q_discretion_opt3: "Quero que seja visível — isso faz parte de quem sou",
    q_collage: "Um yant, ou vários?",
    q_collage_sub: "Muitas pessoas constroem um mapa sagrado do corpo ao longo dos anos.",
    q_collage_opt1: "Um yant perfeito — único e significativo",
    q_collage_opt2: "Uma peça de fundação para começar minha coleção",
    q_collage_opt3: "Quero uma colagem completa — estou pensando grande",
    q_collage_opt4: "Ainda não tenho certeza — mostre-me o que ressoa",
    // Reading
    your_manifestation: "Sua Manifestação",
    your_top_yants: "Seus Melhores Yants",
    tap_details: "Toque qualquer yant para ver detalhes completos",
    your_offerings: "Suas Oferendas",
    explore_library: "Explorar Biblioteca Completa →",
    share_reading: "Compartilhe Sua Leitura",
    copied: "✓ Copiado",
    primary_element_is: "Seu elemento principal é",
    with_strong: "com forte",
    influence: "influência",
    reading_earth: "Você está enraizado — ancorado no que importa, estável quando o mundo abala.",
    reading_water: "Você flui profundamente — sentindo, transformando, carregando correntes que outros não veem.",
    reading_fire: "Você queima — coragem, impulso, uma chama que se recusa a apagar.",
    reading_air: "Você se dirige — sempre olhando para cima, para fora, para o que poderia ser.",
    combo_earth_water: "Enraizado mas fluido. Você se apega ao que importa enquanto solta o que não o serve.",
    combo_earth_fire: "Sólido e feroz. Você protege com a força das montanhas e o calor da convicção.",
    combo_earth_air: "Ancorado mas expansivo. Suas raízes são profundas, mas sua visão alcança longe.",
    combo_water_fire: "Profundidade encontra impulso. Você sente tudo e o canaliza em movimento irresistível para frente.",
    combo_water_air: "Intuitivo e livre. Você sente o que outros perdem e segue correntes que ninguém mais consegue sentir.",
    combo_fire_air: "Queimando brilhante e alcançando alto. Ambição pura temperada por visão e abertura.",
    // Library
    reading_complete: "Leitura Concluída",
    your_yant_library: "Sua Biblioteca Yant",
    design_library: "Biblioteca de Designs",
    in_collection: "na coleção",
    total_designs: "total de designs",
    my_journey: "Minha Jornada",
    view_collection: "Ver Coleção",
    start_over: "Começar Novamente",
    for_you: "Para Você",
    all_n_designs: "Todos os Designs",
    cat_all: "Todos os Designs", cat_geometric: "Geométrico", cat_animal: "Espíritos Animais", cat_deity: "Deidades", cat_nature: "Natureza",
    click_to_learn: "Clique em qualquer design para aprender mais · Use + Adicionar para construir sua coleção",
    in_collection_btn: "✓ Na Coleção", add_btn: "+ Adicionar",
    // Modal
    placement_label: "Colocação", energy_label: "Energia", visibility_label: "Visibilidade", size_label: "Tamanho",
    vis_hidden: "Fácil de esconder", vis_semi: "Semi-oculto", vis_visible: "Visível",
    design_word: "design", collage_note: "Nota da Colagem",
    see_photos: "Ver Fotos de Tatuagens Reais →",
    mark_journey: "Marque Sua Jornada",
    journey_have: "✓ Tenho Isto", journey_next: "Próximo", journey_someday: "Um Dia",
    remove_collection: "Remover da Coleção", add_to_collection: "Adicionar à Coleção",
    // Collage
    your_sacred_collection: "Sua Coleção Sagrada",
    yants_selected: "Yants Selecionados",
    no_designs_yet: "Nenhum design selecionado ainda. Volte e escolha seus yants.",
    placement_collage_notes: "Notas de Colocação & Colagem",
    the_next_step: "O Próximo Passo",
    bring_to_master: "Leve Esta Leitura a um Mestre",
    next_step_desc: "Sua manifestação está completa — mas o yant não é seu até ser dado por um ajarn qualificado ou monge. Compartilhe sua leitura, discuta suas escolhas e receba a bênção com respeito e intenção.",
    copy_consultation: "Copiar Solicitação de Consulta", share_collection: "Compartilhar Coleção",
    sacred_not_decorative: "Sak yants são sagrados — não decorativos.",
    seek_legitimate: "Procure um monge legítimo ou mestre ajarn na Tailândia.",
    approach_humility: "Aproxime-se com humildade, oferendas e intenção sincera.",
    meanings_vary: "Os significados variam por linhagem, ajarn e templo.",
    app_guides: "Este aplicativo orienta — não declara verdade absoluta.",
    remove_btn: "Remover", view_details: "Ver Detalhes", back_to_library: "← Voltar à Biblioteca",
    // Journey
    my_sacred_journey: "Minha Jornada Sagrada",
    your_sak_yant_plan: "Seu Plano Sak Yant",
    received_word: "recebido", planned_word: "planejado", someday_word: "um dia",
    library_btn: "← Biblioteca", collection_btn: "Coleção",
    filter_all: "Todos", filter_received: "Recebido ✓", filter_next: "Próximo", filter_someday: "Um Dia",
    journey_empty: "Sua jornada começa aqui. Explore a biblioteca e marque yants que você tem, quer depois, ou sonha.",
    browse_library: "Explorar Biblioteca",
    have_it: "✓ Tenho", next_btn: "Próximo", someday_btn: "Um Dia",
    add_note: "+ Adicione uma nota pessoal",
    note_placeholder: "Adicione uma nota pessoal — quando você recebeu, quem o deu, como se sentiu...",
    note_save_hint: "Pressione Enter para salvar · Shift+Enter para nova linha",
    journey_summary: "Resumo da Jornada",
    stat_received: "Recebido", stat_getting_next: "Próximo", stat_someday: "Um Dia", stat_total: "Total Planejado",
    language: "Idioma",
  },
  ru: {
    // Intro
    sacred_geometry: "Священная геометрия · Древнее благословение",
    app_title: "Оракул Сак Янтра",
    app_subtitle: "Руководство по татуировкам и библиотека дизайнов",
    intro_desc: "Сак янтры — это священные геометрические татуировки из Таиланда, Камбоджи и Лаоса — благословленные монахами и мастерами аджарн, несущие истинный духовный вес.",
    intro_sub: "Пройдите через четыре элемента, принесите свои намерения и получите свое персональное проявление янтры. Путешествие займет около двух минут.",
    begin_reading: "Начать Чтение",
    browse_all: "Посмотреть Все",
    designs: "Дизайны",
    continue_journey: "Продолжить Мой Путь",
    yants_word: "янтры",
    approach_respect: "Подходите с Уважением",
    disclaimer: "Значения различаются в зависимости от линии, аджарна и храма. Это приложение направляет — не объявляет. Окончательный дизайн и размещение всегда должны быть подтверждены квалифицированным практиком.",
    // Elements
    elem_earth: "Земля", elem_water: "Вода", elem_fire: "Огонь", elem_air: "Воздух",
    elem_earth_desc: "Основание · Корни · То, что ты защищаешь",
    elem_water_desc: "Глубина · Интуиция · То, что течет сквозь тебя",
    elem_fire_desc: "Импульс · Мужество · То, что горит в тебе",
    elem_air_desc: "Видение · Свобода · То, к чему ты стремишься",
    // Offerings
    off_protection: "Защита", off_fortune: "Удача", off_courage: "Мужество",
    off_love: "Любовь & Харизма", off_wisdom: "Мудрость", off_travel: "Безопасные Путешествия",
    off_discipline: "Дисциплина", off_transformation: "Трансформация", off_success: "Успех",
    // Body Areas
    area_upper_back: "Верхняя спина", area_center_back: "Центр спины", area_neck_spine: "Шея / Позвоночник",
    area_shoulder: "Плечо", area_chest: "Грудь", area_upper_arm: "Верхняя часть руки",
    area_forearm: "Предплечье", area_thigh: "Бедро", area_calf: "Голень",
    // Quiz Nav
    back: "← Назад", continue_btn: "Продолжить →", reveal_yants: "Раскрыть Мои Янтры",
    of_word: "из", selected: "выбран", select_at_least: "выбери по крайней мере",
    areas_selected: "выбранная(ые) область(и)",
    // Questions
    q_path: "Как ты хочешь пройти этот путь?",
    q_path_sub: "Это формирует руководство, которое ты получишь.",
    q_path_opt1: "Я ищу дизайн, который следует ancestральной линии — традиционное размещение, традиционное значение",
    q_path_opt2: "Я ищу дизайн, который служит личным символическим якорем — значение важно, но на моих условиях",
    q_path_opt3: "Я все еще учусь — направляй меня, и я буду слушать",
    q_earth: "Что лежит в основе под твоими ногами?",
    q_earth_sub: "Земля спрашивает: на чем ты стоишь?",
    q_earth_opt1: "Мой народ — те, ради которых я сделаю все",
    q_earth_opt2: "Мои собственные руки — то, что я построил и пережил",
    q_earth_opt3: "Что-то древнее — традиция, род, корни глубже, чем я",
    q_earth_opt4: "Честно говоря? Я все еще это строю",
    q_water: "Что течет под твоей поверхностью?",
    q_water_sub: "Вода спрашивает: что ты несешь, чего не видят другие?",
    q_water_opt1: "Глубокая интуиция — я чувствую вещи раньше, чем они происходят",
    q_water_opt2: "Старую боль, которую я учусь отпускать",
    q_water_opt3: "Тихую любовь, которая течет глубже, чем я показываю",
    q_water_opt4: "Беспокойство — течение, тянущее меня куда-то новое",
    q_fire: "За что ты пройдешь сквозь огонь?",
    q_fire_sub: "Огонь спрашивает: что делает тебя опасным — в лучшем смысле?",
    q_fire_opt1: "Людей, которых я люблю — без колебаний",
    q_fire_opt2: "Мою собственную свободу — я отказываюсь быть в клетке",
    q_fire_opt3: "Что-то, что я еще не построил — видение, которое видит только я",
    q_fire_opt4: "То, что правильно — я борюсь за справедливость, даже если это мне стоит",
    q_air: "Закрой глаза. Что ты видишь?",
    q_air_sub: "Воздух спрашивает: к чему ты стремишься?",
    q_air_opt1: "Тишину — мир после всего, что я прошел",
    q_air_opt2: "Изобилие — я хочу, чтобы жизнь переполнялась хорошим",
    q_air_opt3: "Связь — быть действительно видимым и глубоко узнанным",
    q_air_opt4: "Неизвестное — где-то, где я никогда не был",
    q_offerings: "Положи свои приношения на стол.",
    q_offerings_sub: "Выбери 2 или 3 намерения, которые будет нести твоя янтра.",
    q_balance: "Какого элемента тебе нужно больше?",
    q_balance_sub: "Не то, что ты есть — то, чего не хватает. Янтра заполняет пустоту.",
    q_balance_opt1: "Земля — Мне нужна основа, корни, что-то твердое под мной",
    q_balance_opt2: "Вода — Мне нужно снова почувствовать, отпустить, трансформироваться",
    q_balance_opt3: "Огонь — Мне нужно мужество, сила, воля наконец действовать",
    q_balance_opt4: "Воздух — Мне нужна легкость, видение, пространство для дыхания",
    q_placement: "Где на своем теле ты чувствуешь, что это принадлежит?",
    q_placement_sub: "Коснись областей, к которым ты открыт. Ты можешь выбрать несколько.",
    q_discretion: "Это должно остаться между тобой и чернилами?",
    q_discretion_sub: "Без суда — практические потребности определяют правильный выбор.",
    q_discretion_opt1: "Да — это должно быть легко скрыть",
    q_discretion_opt2: "Мне не против, если иногда это будет видно",
    q_discretion_opt3: "Я хочу, чтобы это было видно — это часть того, кто я",
    q_collage: "Одна янтра или много?",
    q_collage_sub: "Многие люди строят священную карту тела на протяжении лет.",
    q_collage_opt1: "Одна совершенная янтра — единственная и значимая",
    q_collage_opt2: "Базовая работа, чтобы начать мою коллекцию",
    q_collage_opt3: "Я хочу полный коллаж — я думаю масштабно",
    q_collage_opt4: "Еще не уверен — покажи мне, что резонирует",
    // Reading
    your_manifestation: "Твое Проявление",
    your_top_yants: "Твои Лучшие Янтры",
    tap_details: "Коснись любой янтры, чтобы увидеть полные детали",
    your_offerings: "Твои Приношения",
    explore_library: "Исследовать Полную Библиотеку →",
    share_reading: "Поделись Своим Чтением",
    copied: "✓ Скопировано",
    primary_element_is: "Твой первичный элемент —",
    with_strong: "с сильным",
    influence: "влиянием",
    reading_earth: "Ты укоренен — заземлен в том, что важно, стабилен, когда мир содрогается.",
    reading_water: "Ты течешь глубоко — чувствуя, трансформируясь, неся течения, которые другие не видят.",
    reading_fire: "Ты горишь — мужество, импульс, пламя, которое отказывается угасать.",
    reading_air: "Ты стремишься — всегда глядя вверх, наружу, к тому, что могло бы быть.",
    combo_earth_water: "Укоренен, но текуч. Ты держишься за то, что важно, отпуская то, что тебе не служит.",
    combo_earth_fire: "Прочен и свиреп. Ты защищаешь силой гор и жаром убеждения.",
    combo_earth_air: "Заземлен, но расширяющийся. Твои корни уходят глубоко, но твое видение достигает далеко.",
    combo_water_fire: "Глубина встречает импульс. Ты чувствуешь все и направляешь это в неустанное движение вперед.",
    combo_water_air: "Интуитивен и свободен. Ты чувствуешь, что упускают другие, и следуешь течениям, которые никто другой не может чувствовать.",
    combo_fire_air: "Горящий ярко и достигающий высоко. Чистое честолюбие, смягченное видением и открытостью.",
    // Library
    reading_complete: "Чтение Завершено",
    your_yant_library: "Твоя Библиотека Янтр",
    design_library: "Библиотека Дизайнов",
    in_collection: "в коллекции",
    total_designs: "всего дизайнов",
    my_journey: "Мой Путь",
    view_collection: "Просмотреть Коллекцию",
    start_over: "Начать Заново",
    for_you: "Для Тебя",
    all_n_designs: "Все Дизайны",
    cat_all: "Все Дизайны", cat_geometric: "Геометрические", cat_animal: "Духи Животных", cat_deity: "Божества", cat_nature: "Природа",
    click_to_learn: "Нажми на любой дизайн для подробностей · Используй + Добавить, чтобы построить свою коллекцию",
    in_collection_btn: "✓ В Коллекции", add_btn: "+ Добавить",
    // Modal
    placement_label: "Размещение", energy_label: "Энергия", visibility_label: "Видимость", size_label: "Размер",
    vis_hidden: "Легко скрыть", vis_semi: "Полускрыто", vis_visible: "Видно",
    design_word: "дизайн", collage_note: "Заметка о Коллаже",
    see_photos: "Посмотреть Реальные Фото Татуировок →",
    mark_journey: "Отметь Свой Путь",
    journey_have: "✓ У Меня Есть", journey_next: "Следующая", journey_someday: "Когда-нибудь",
    remove_collection: "Удалить из Коллекции", add_to_collection: "Добавить в Коллекцию",
    // Collage
    your_sacred_collection: "Твоя Священная Коллекция",
    yants_selected: "Янтры Выбраны",
    no_designs_yet: "Пока нет выбранных дизайнов. Вернись и выбери свои янтры.",
    placement_collage_notes: "Заметки о Размещении и Коллаже",
    the_next_step: "Следующий Шаг",
    bring_to_master: "Принеси Это Чтение к Мастеру",
    next_step_desc: "Твое проявление завершено — но янтра не твоя, пока ее не даст квалифицированный аджарн или монах. Поделись своим чтением, обсуди свои выборы и получи благословение с уважением и намерением.",
    copy_consultation: "Скопировать Запрос Консультации", share_collection: "Поделиться Коллекцией",
    sacred_not_decorative: "Сак янтры священны — не декоративны.",
    seek_legitimate: "Найди легитимного монаха или мастера аджарна в Таиланде.",
    approach_humility: "Подходи с смирением, приношениями и искренним намерением.",
    meanings_vary: "Значения различаются в зависимости от линии, аджарна и храма.",
    app_guides: "Это приложение направляет — не объявляет абсолютную истину.",
    remove_btn: "Удалить", view_details: "Посмотреть Детали", back_to_library: "← Вернуться к Библиотеке",
    // Journey
    my_sacred_journey: "Мой Священный Путь",
    your_sak_yant_plan: "Твой План Сак Янтра",
    received_word: "получено", planned_word: "запланировано", someday_word: "когда-нибудь",
    library_btn: "← Библиотека", collection_btn: "Коллекция",
    filter_all: "Все", filter_received: "Получено ✓", filter_next: "Следующая", filter_someday: "Когда-нибудь",
    journey_empty: "Твой путь начинается здесь. Исследуй библиотеку и отмечай янтры, которые у тебя есть, которые ты хочешь дальше, или о которых мечтаешь.",
    browse_library: "Исследовать Библиотеку",
    have_it: "✓ Имею", next_btn: "Следующая", someday_btn: "Когда-нибудь",
    add_note: "+ Добавь личную заметку",
    note_placeholder: "Добавь личную заметку — когда ты ее получил, кто ее тебе дал, как это чувствовалось...",
    note_save_hint: "Нажми Enter для сохранения · Shift+Enter для новой строки",
    journey_summary: "Резюме Пути",
    stat_received: "Получено", stat_getting_next: "Следующая", stat_someday: "Когда-нибудь", stat_total: "Всего Запланировано",
    language: "Язык",
  }

}

const LANGUAGES = [
  {code:"en",label:"English",flag:"🇬🇧"},
  {code:"th",label:"ไทย",flag:"🇹🇭"},
  {code:"ja",label:"日本語",flag:"🇯🇵"},
  {code:"zh",label:"中文",flag:"🇨🇳"},
  {code:"ko",label:"한국어",flag:"🇰🇷"},
  {code:"de",label:"Deutsch",flag:"🇩🇪"},
  {code:"fr",label:"Français",flag:"🇫🇷"},
  {code:"es",label:"Español",flag:"🇪🇸"},
  {code:"pt",label:"Português",flag:"🇧🇷"},
  {code:"ru",label:"Русский",flag:"🇷🇺"},
];

// t() is a live function — reads current language at call time
const t = (key) => TRANSLATIONS[window.__sakyant_lang__ || "en"]?.[key] || TRANSLATIONS.en[key] || key;

const ELEMENTS = {
  earth: { symbol: "◆", color: "#8B7355" },
  water: { symbol: "◎", color: "#5B7B8A" },
  fire:  { symbol: "△", color: "#A0522D" },
  air:   { symbol: "○", color: "#8A8A6E" },
};
// Helper to get translated element name/desc/thai
const elName = (key) => t("elem_"+key);
const elThai = (key) => ({earth:"ดิน",water:"น้ำ",fire:"ไฟ",air:"ลม"}[key]);
const elDesc = (key) => t("elem_"+key+"_desc");

const OFFERINGS = [
  { id: "protection", tKey: "off_protection", thai: "ป้องกัน", icon: "◇", traits: ["protection", "foundation", "resilience", "warrior"] },
  { id: "luck", tKey: "off_fortune", thai: "โชคดี", icon: "✦", traits: ["luck", "abundance", "manifestation", "optimism"] },
  { id: "courage", tKey: "off_courage", thai: "กล้าหาญ", icon: "△", traits: ["courage", "strength", "warrior", "authority"] },
  { id: "love", tKey: "off_love", thai: "เมตตา", icon: "❋", traits: ["charisma", "love", "community", "communication"] },
  { id: "wisdom", tKey: "off_wisdom", thai: "ปัญญา", icon: "◎", traits: ["wisdom", "spirituality", "tradition", "depth"] },
  { id: "travel", tKey: "off_travel", thai: "เดินทาง", icon: "✧", traits: ["travel", "freedom", "adaptability", "wandering"] },
  { id: "discipline", tKey: "off_discipline", thai: "วินัย", icon: "▪", traits: ["discipline", "balance", "foundation", "resilience"] },
  { id: "rebirth", tKey: "off_transformation", thai: "เกิดใหม่", icon: "◯", traits: ["transformation", "rebirth", "intuition", "depth"] },
  { id: "success", tKey: "off_success", thai: "สำเร็จ", icon: "◈", traits: ["ambition", "leadership", "manifestation", "abundance"] },
];

const BODY_AREAS = [
  { id: "upper_back", tKey: "area_upper_back", y: 18, x: 50, side: "back" },
  { id: "center_back", tKey: "area_center_back", y: 38, x: 50, side: "back" },
  { id: "neck_spine", tKey: "area_neck_spine", y: 8, x: 50, side: "back" },
  { id: "shoulder", tKey: "area_shoulder", y: 16, x: 28, side: "back" },
  { id: "chest", tKey: "area_chest", y: 22, x: 50, side: "front" },
  { id: "upper_arm", tKey: "area_upper_arm", y: 30, x: 18, side: "front" },
  { id: "forearm", tKey: "area_forearm", y: 48, x: 14, side: "front" },
  { id: "thigh", tKey: "area_thigh", y: 58, x: 35, side: "front" },
  { id: "calf", tKey: "area_calf", y: 76, x: 36, side: "front" },
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

function getQuestions() { return [
  {
    id: "path", element: null, type: "single",
    question: t("q_path"),
    sub: t("q_path_sub"),
    options: [
      { label: t("q_path_opt1"), value: "traditional", traits: ["tradition", "spirituality", "foundation", "wisdom"] },
      { label: t("q_path_opt2"), value: "personal", traits: ["independence", "adaptability", "freedom"] },
      { label: t("q_path_opt3"), value: "learning", traits: ["curiosity", "wisdom", "balance"] },
    ]
  },
  {
    id: "earth", element: "earth", type: "single",
    question: t("q_earth"),
    sub: t("q_earth_sub"),
    options: [
      { label: t("q_earth_opt1"), value: "earth_people", element: "earth", traits: ["loyalty", "community", "devotion", "foundation"] },
      { label: t("q_earth_opt2"), value: "earth_self", element: "earth", traits: ["resilience", "independence", "strength", "discipline"] },
      { label: t("q_earth_opt3"), value: "earth_roots", element: "earth", traits: ["tradition", "wisdom", "foundation", "spirituality"] },
      { label: t("q_earth_opt4"), value: "earth_building", element: "earth", traits: ["transformation", "adaptability", "courage", "rebirth"] },
    ]
  },
  {
    id: "water", element: "water", type: "single",
    question: t("q_water"),
    sub: t("q_water_sub"),
    options: [
      { label: t("q_water_opt1"), value: "water_intuition", element: "water", traits: ["intuition", "mystery", "depth", "wisdom"] },
      { label: t("q_water_opt2"), value: "water_release", element: "water", traits: ["transformation", "rebirth", "resilience", "adaptability"] },
      { label: t("q_water_opt3"), value: "water_love", element: "water", traits: ["devotion", "loyalty", "love", "community"] },
      { label: t("q_water_opt4"), value: "water_restless", element: "water", traits: ["travel", "freedom", "wandering", "curiosity"] },
    ]
  },
  {
    id: "fire", element: "fire", type: "single",
    question: t("q_fire"),
    sub: t("q_fire_sub"),
    options: [
      { label: t("q_fire_opt1"), value: "fire_protect", element: "fire", traits: ["loyalty", "devotion", "strength", "warrior"] },
      { label: t("q_fire_opt2"), value: "fire_freedom", element: "fire", traits: ["freedom", "independence", "courage", "authority"] },
      { label: t("q_fire_opt3"), value: "fire_vision", element: "fire", traits: ["ambition", "leadership", "manifestation", "creativity"] },
      { label: t("q_fire_opt4"), value: "fire_justice", element: "fire", traits: ["courage", "warrior", "protection", "discipline"] },
    ]
  },
  {
    id: "air", element: "air", type: "single",
    question: t("q_air"),
    sub: t("q_air_sub"),
    options: [
      { label: t("q_air_opt1"), value: "air_peace", element: "air", traits: ["balance", "spirituality", "wisdom", "tradition"] },
      { label: t("q_air_opt2"), value: "air_abundance", element: "air", traits: ["abundance", "luck", "manifestation", "joy", "optimism"] },
      { label: t("q_air_opt3"), value: "air_connection", element: "air", traits: ["charisma", "love", "community", "communication"] },
      { label: t("q_air_opt4"), value: "air_unknown", element: "air", traits: ["travel", "freedom", "curiosity", "adaptability"] },
    ]
  },
  {
    id: "offerings", element: null, type: "multi",
    question: t("q_offerings"),
    sub: t("q_offerings_sub"),
    maxSelect: 3,
    minSelect: 2,
    options: null,
  },
  {
    id: "balance", element: null, type: "single",
    question: t("q_balance"),
    sub: t("q_balance_sub"),
    options: [
      { label: t("q_balance_opt1"), value: "need_earth", element: "earth", traits: ["foundation", "protection", "balance", "tradition", "discipline"] },
      { label: t("q_balance_opt2"), value: "need_water", element: "water", traits: ["transformation", "intuition", "depth", "rebirth", "adaptability"] },
      { label: t("q_balance_opt3"), value: "need_fire", element: "fire", traits: ["strength", "courage", "warrior", "authority", "ambition"] },
      { label: t("q_balance_opt4"), value: "need_air", element: "air", traits: ["freedom", "joy", "abundance", "spirituality", "curiosity"] },
    ]
  },
  {
    id: "placement", element: null, type: "areas",
    question: t("q_placement"),
    sub: t("q_placement_sub"),
    options: null,
  },
  {
    id: "discretion", element: null, type: "single",
    question: t("q_discretion"),
    sub: t("q_discretion_sub"),
    options: [
      { label: t("q_discretion_opt1"), value: "hidden", traits: [] },
      { label: t("q_discretion_opt2"), value: "semi", traits: [] },
      { label: t("q_discretion_opt3"), value: "visible", traits: [] },
    ]
  },
  {
    id: "collage", element: null, type: "single",
    question: t("q_collage"),
    sub: t("q_collage_sub"),
    options: [
      { label: t("q_collage_opt1"), value: "one", traits: ["tradition", "completeness"] },
      { label: t("q_collage_opt2"), value: "start", traits: ["foundation", "balance"] },
      { label: t("q_collage_opt3"), value: "collage", traits: ["completeness", "ambition", "wisdom"] },
      { label: t("q_collage_opt4"), value: "open", traits: [] },
    ]
  },
]; }

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
// CAT_L is computed inside App component via useMemo

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
            {ELEMENTS[yant.element].symbol} {elName(yant.element)}
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
        {selected ? t("in_collection_btn") : t("add_btn")}
      </button>
    </div>
  );
}

function BodyPreview({ yant, onClose }) {
  const [view, setView] = useState("back");
  const [activeZone, setActiveZone] = useState(null);
  
  const sizeMap = { small: 40, medium: 60, large: 80 };
  const yantSize = sizeMap[yant.size] || 60;
  
  // Back view zones
  const backZones = {
    neck_spine: { x: 150, y: 50, w: 40, h: 40 },
    upper_back: { x: 110, y: 120, w: 80, h: 70 },
    center_back: { x: 110, y: 210, w: 80, h: 70 },
    shoulder_left: { x: 70, y: 110, w: 40, h: 40 },
    shoulder_right: { x: 190, y: 110, w: 40, h: 40 },
  };
  
  // Front view zones
  const frontZones = {
    chest: { x: 110, y: 140, w: 80, h: 70 },
    upper_arm_left: { x: 60, y: 160, w: 35, h: 60 },
    upper_arm_right: { x: 205, y: 160, w: 35, h: 60 },
    forearm_left: { x: 50, y: 235, w: 30, h: 60 },
    forearm_right: { x: 220, y: 235, w: 30, h: 60 },
    thigh_left: { x: 90, y: 340, w: 40, h: 70 },
    thigh_right: { x: 170, y: 340, w: 40, h: 70 },
    calf_left: { x: 100, y: 425, w: 35, h: 60 },
    calf_right: { x: 165, y: 425, w: 35, h: 60 },
  };
  
  const zones = view === "back" ? backZones : frontZones;
  
  // SVG for back view
  const BackSVG = () => (
    <svg viewBox="0 0 300 500" style={{ width: "100%", maxWidth: 300 }}>
      {/* Head */}
      <circle cx="150" cy="40" r="22" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Neck */}
      <line x1="150" y1="62" x2="150" y2="90" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Shoulders */}
      <path d="M 90 95 Q 150 85 210 95" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Spine line */}
      <line x1="150" y1="90" x2="150" y2="310" stroke={G} strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
      {/* Upper back/shoulders */}
      <path d="M 110 100 Q 150 95 190 100 L 195 170 Q 150 175 105 170 Z" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Torso */}
      <path d="M 105 170 L 95 280 Q 95 310 105 330 L 150 340 L 195 330 Q 205 310 205 280 L 195 170 Z" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Arms */}
      <path d="M 105 130 L 50 160 Q 35 180 40 240" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      <path d="M 195 130 L 250 160 Q 265 180 260 240" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Legs */}
      <path d="M 120 330 L 115 450 Q 115 470 125 480" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      <path d="M 180 330 L 185 450 Q 185 470 175 480" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      
      {/* Interactive zones */}
      {Object.entries(zones).map(([id, zone]) => (
        <g key={id}>
          <rect
            x={zone.x} y={zone.y} width={zone.w} height={zone.h}
            fill="none"
            stroke={activeZone === id ? G : "transparent"}
            strokeWidth="1.5"
            strokeDasharray={activeZone === id ? "4,4" : "none"}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setActiveZone(id)}
            onMouseLeave={() => {}}
            onClick={() => setActiveZone(id)}
            opacity={activeZone === id ? 0.7 : 0}
          />
          {activeZone === id && (
            <rect
              x={zone.x} y={zone.y} width={zone.w} height={zone.h}
              fill={G} opacity="0.08" pointerEvents="none"
            />
          )}
        </g>
      ))}
    </svg>
  );
  
  // SVG for front view
  const FrontSVG = () => (
    <svg viewBox="0 0 300 500" style={{ width: "100%", maxWidth: 300 }}>
      {/* Head */}
      <circle cx="150" cy="40" r="22" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Neck */}
      <line x1="150" y1="62" x2="150" y2="90" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Shoulders */}
      <path d="M 90 95 Q 150 85 210 95" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Chest/torso */}
      <path d="M 100 100 L 90 220 Q 90 250 100 280 L 150 290 L 200 280 Q 210 250 210 220 L 200 100 Z" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Chest center line */}
      <line x1="150" y1="100" x2="150" y2="220" stroke={G} strokeWidth="1" opacity="0.4" strokeDasharray="3,3" />
      {/* Upper arms */}
      <path d="M 100 115 L 55 160 Q 40 185 38 240" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      <path d="M 200 115 L 245 160 Q 260 185 262 240" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Forearms */}
      <path d="M 50 240 L 35 320 Q 30 350 40 370" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      <path d="M 250 240 L 265 320 Q 270 350 260 370" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Hips/thighs */}
      <path d="M 110 290 L 110 370 Q 110 390 120 400" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      <path d="M 190 290 L 190 370 Q 190 390 180 400" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      {/* Calves */}
      <path d="M 115 400 L 115 480 Q 115 495 125 500" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      <path d="M 185 400 L 185 480 Q 185 495 175 500" fill="none" stroke={G} strokeWidth="1.5" opacity="0.6" />
      
      {/* Interactive zones */}
      {Object.entries(zones).map(([id, zone]) => (
        <g key={id}>
          <rect
            x={zone.x} y={zone.y} width={zone.w} height={zone.h}
            fill="none"
            stroke={activeZone === id ? G : "transparent"}
            strokeWidth="1.5"
            strokeDasharray={activeZone === id ? "4,4" : "none"}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setActiveZone(id)}
            onMouseLeave={() => {}}
            onClick={() => setActiveZone(id)}
            opacity={activeZone === id ? 0.7 : 0}
          />
          {activeZone === id && (
            <rect
              x={zone.x} y={zone.y} width={zone.w} height={zone.h}
              fill={G} opacity="0.08" pointerEvents="none"
            />
          )}
        </g>
      ))}
    </svg>
  );
  
  const zoneLabels = {
    neck_spine: t("area_neck_spine"),
    upper_back: t("area_upper_back"),
    center_back: t("area_center_back"),
    shoulder_left: t("area_shoulder") + " (L)",
    shoulder_right: t("area_shoulder") + " (R)",
    chest: t("area_chest"),
    upper_arm_left: t("area_upper_arm") + " (L)",
    upper_arm_right: t("area_upper_arm") + " (R)",
    forearm_left: t("area_forearm") + " (L)",
    forearm_right: t("area_forearm") + " (R)",
    thigh_left: t("area_thigh") + " (L)",
    thigh_right: t("area_thigh") + " (R)",
    calf_left: t("area_calf") + " (L)",
    calf_right: t("area_calf") + " (R)",
  };
  
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(8,6,3,0.96)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ maxWidth:420, width:"100%", textAlign:"center" }}>
        <button onClick={onClose} style={{ position:"absolute", top:20, right:20, background:"none", border:"none", color:DIM, fontSize:18, cursor:"pointer", zIndex:301 }}>✕</button>
        
        <div style={{ color:G, fontSize:13, letterSpacing:3, textTransform:"uppercase", marginBottom:20, fontWeight:"normal" }}>{t("preview_placement")}</div>
        
        <div style={{ color:WARM, fontSize:18, marginBottom:16, fontWeight:"normal" }}>{yant.name}</div>
        
        {/* Front/Back Toggle */}
        <div style={{ display:"flex", gap:8, marginBottom:24, justifyContent:"center" }}>
          {[["back", t("back_view")], ["front", t("front_view")]].map(([v, label]) => (
            <button key={v} onClick={() => { setView(v); setActiveZone(null); }} style={{
              flex: 1, padding:"10px 16px", fontSize:11, letterSpacing:2, textTransform:"uppercase",
              fontFamily:"Georgia,serif", cursor:"pointer",
              background: view === v ? G : "transparent",
              border: `1px solid ${view === v ? G : SUB}`,
              color: view === v ? DARK : DIM,
              transition:"all 0.2s ease",
            }}>
              {label}
            </button>
          ))}
        </div>
        
        {/* Body SVG */}
        <div style={{ background:"rgba(201,168,76,0.03)", border:`1px solid ${SUB}`, padding:"24px 20px", marginBottom:20, borderRadius:"2px" }}>
          {view === "back" ? <BackSVG /> : <FrontSVG />}
        </div>
        
        {/* Instructions and zone label */}
        <div style={{ color:DIM, fontSize:11, letterSpacing:1, marginBottom:12, minHeight:"22px" }}>
          {activeZone ? zoneLabels[activeZone] : t("tap_to_place")}
        </div>
        
        {/* Yant preview at zone */}
        {activeZone && (
          <div style={{ background:"rgba(201,168,76,0.04)", border:`1px solid rgba(201,168,76,0.15)`, padding:"16px", marginBottom:20 }}>
            <div style={{ fontSize:9, letterSpacing:2, color:G, textTransform:"uppercase", marginBottom:8 }}>Placement Preview</div>
            <div style={{ width:yantSize, height:yantSize, color:G, margin:"0 auto", opacity:0.85, filter:"drop-shadow(0 0 8px rgba(201,168,76,0.3))" }} dangerouslySetInnerHTML={{ __html: yant.svg }} />
          </div>
        )}
      </div>
    </div>
  );
}


function Modal({ yantKey, yant, inCollage, onToggle, onClose, currentStatus, onSetStatus, setBodyPreview }) {
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
            <span style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", border:`1px solid ${ELEMENTS[yant.element].color}`, color:ELEMENTS[yant.element].color, padding:"3px 8px" }}>{ELEMENTS[yant.element].symbol} {elName(yant.element)}</span>
          )}
          {yant.traits.map(t=>(
            <span key={t} style={{ fontSize:9, letterSpacing:2, textTransform:"uppercase", border:`1px solid rgba(201,168,76,0.22)`, color:G, padding:"3px 8px" }}>{t}</span>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {[[t("placement_label"), yant.placement], [t("energy_label"), yant.energy], [t("visibility_label"), yant.visibility === "hidden" ? t("vis_hidden") : yant.visibility === "semi" ? t("vis_semi") : t("vis_visible")], [t("size_label"), yant.size ? yant.size.charAt(0).toUpperCase() + yant.size.slice(1) + " design" : ""]].filter(([,v])=>v).map(([l,v])=>(
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

        <button onClick={() => { setBodyPreview(yantKey); }} style={{
          display:"block", width:"100%", background:"transparent", border:`1px solid ${SUB}`,
          color:DIM, padding:"12px", fontSize:10, letterSpacing:3,
          textTransform:"uppercase", cursor:"pointer", fontFamily:"Georgia,serif",
          textAlign:"center", textDecoration:"none", marginBottom:12,
          transition:"all 0.18s ease",
        }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=G; e.currentTarget.style.color=G; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=SUB; e.currentTarget.style.color=DIM; }}
        >{t("preview_on_body")}</button>

        {/* Journey Status */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:9, letterSpacing:3, color:DIM, textTransform:"uppercase", marginBottom:8 }}>Mark Your Journey</div>
          <div style={{ display:"flex", gap:8 }}>
            {[["have",t("journey_have"), "#4A7A5A"],["next",t("stat_getting_next"), G],[t("someday_word"),t("stat_someday"), "#5B7B8A"]].map(([s, label, color]) => (
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
        }}>{inCollage ? t("remove_collection") : t("add_to_collection")}</button>
      </div>
    </div>
  );
}


export default function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("sakyant_lang") || "en"; } catch(e) { return "en"; } });
  const [showLang, setShowLang] = useState(false);
  // Set language synchronously so t() works during this render
  window.__sakyant_lang__ = lang;
  useEffect(() => { try { localStorage.setItem("sakyant_lang", lang); } catch(e) {} }, [lang]);
  // Re-compute translated data when language changes
  const QUESTIONS = useMemo(() => getQuestions(), [lang]);
  const CAT_L = useMemo(() => ({ all: t("cat_all"), geometric: t("cat_geometric"), animal: t("cat_animal"), deity: t("cat_deity"), nature: t("cat_nature") }), [lang]);

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

  const [bodyPreview, setBodyPreview] = useState(null);  const [discretion, setDiscretion] = useState(null);
  const [pathChoice, setPathChoice] = useState(null);
  const [journey, setJourney] = useState({}); // { yantKey: "have" | "next" | t("someday_word") }
  const [journeyNotes, setJourneyNotes] = useState({}); // { yantKey: "note text" }
  const [journeyFilter, setJourneyFilter] = useState("all"); // "all" | "have" | "next" | t("someday_word")
  const [editingNote, setEditingNote] = useState(null); // yantKey being edited

  const [qrData, setQrData] = useState(null);
  const [soundOn, setSoundOn] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isShared, setIsShared] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => { setTimeout(()=>setLoaded(true),80); },[]);

  // Hydrate from shared URL (?r=base64json)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const r = params.get("r");
      if (!r) return;
      const data = JSON.parse(decodeURIComponent(escape(atob(r.replace(/-/g,'+').replace(/_/g,'/')))));
      if (data && data.a) {
        const ans = data.a;
        const ba = data.b || [];
        const disc = data.d || null;
        const offs = data.o || [];
        const scored = scoreYants(ans, ba, disc);
        setAnswers(ans);
        setBodyAreas(ba);
        setDiscretion(disc);
        setOfferings(new Set(offs));
        setRanked(scored);
        setCollage(new Set(scored.slice(0,3).map(x=>x.key)));
        setElementProfile(getElementProfile(ans));
        setIsShared(true);
        setPhase("reading");
      }
    } catch(e) { console.warn("share hydrate failed", e); }
  }, []);

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

  const c = (dark, light) => theme === "dark" ? dark : light;
  const LIGHT = { bg:"#F5F0E6", deep:"#EDE8DC", warm:"#2A2318", dim:"#6A6050", mid:"#4A4030", sub:"#D5D0C4", g:"#8B7030" };

  const toggleSound = () => {
    if (soundOn) {
      if (audioRef.current) {
        audioRef.current.dispose?.();
        audioRef.current = null;
      }
      setSoundOn(false);
      try { localStorage.setItem("sakyant_sound", "false"); } catch(e) {}
    } else {
      setSoundOn(true);
      try { localStorage.setItem("sakyant_sound", "true"); } catch(e) {} 
      initSound();
    }
  };

  const initSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      
      // Create oscillators for A2 and E3
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      osc1.frequency.value = 110; // A2
      osc2.frequency.value = 165; // E3
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      // Create gain nodes
      const gainOsc1 = audioContext.createGain();
      const gainOsc2 = audioContext.createGain();
      gainOsc1.gain.value = 0.03;
      gainOsc2.gain.value = 0.02;
      
      // Create master gain for overall volume control
      const masterGain = audioContext.createGain();
      masterGain.gain.value = 0.1;
      
      // Create tremolo LFO
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.value = 0.1;
      lfo.type = 'sine';
      lfoGain.gain.value = 0.05;
      
      // Connect tremolo to master gain
      lfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);
      
      // Connect oscillators
      osc1.connect(gainOsc1);
      osc2.connect(gainOsc2);
      gainOsc1.connect(masterGain);
      gainOsc2.connect(masterGain);
      masterGain.connect(audioContext.destination);
      
      // Start oscillators
      osc1.start(now);
      osc2.start(now);
      lfo.start(now);
      
      // Schedule stop after long time (10 hours)
      osc1.stop(now + 36000);
      osc2.stop(now + 36000);
      lfo.stop(now + 36000);
      
      audioRef.current = { osc1, osc2, lfo, audioContext, dispose: () => { try { audioContext.close(); } catch(e) {} } };
    } catch(e) { console.error('Audio init error:', e); }
  };

  // Load sound preference
  useEffect(() => {
    try { const saved = localStorage.getItem("sakyant_sound"); if (saved === "true") { setSoundOn(true); } } catch(e) {}
  }, []);

  // Initialize sound when soundOn becomes true
  useEffect(() => {
    if (soundOn && !audioRef.current) {
      initSound();
    }
  }, [soundOn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.dispose?.();
      }
    };
  }, []);


  const generateQRCode = async () => {
    try {
      const yantNames = [...collage].map(k => YANTS[k]).filter(Boolean).map(y => `${y.name} (${y.thai})`).join(", ");
      const sorted = elementProfile ? Object.entries(elementProfile).sort((a,b) => b[1] - a[1]) : [];
      const primaryEl = sorted.length > 0 ? elName(sorted[0][0]) : "";
      const text = `✦ Sak Yant Consultation Request ✦

I've completed my Sak Yant Oracle reading and would like to discuss receiving the following designs:

Selected Yants: ${yantNames}
${primaryEl ? `Primary Element: ${primaryEl}` : ""}

I approach with respect and sincere intent. I would like to learn more about receiving these yants in the traditional way.

— Via Sak Yant Oracle`;
      
      const qr = await QRCode.toDataURL(text, { width: 256, margin: 2, color: { dark: '#C9A84C', light: '#0D0B07' } });
      setQrData(qr);
    } catch(e) {
      console.error('QR generation failed:', e);
    }
  };

    const reset = () => { setPhase("intro"); setCurrentQ(0); setAnswers([]); setSelected(null); setRanked([]); setCollage(new Set()); setFilter("all"); setDetail(null); setTab("recommended"); setElementProfile(null); setOfferings(new Set()); setBodyAreas([]); setDiscretion(null); setPathChoice(null); setJourneyFilter("all"); setEditingNote(null); };

  const yantEntries = Object.entries(YANTS);
  const filtered = filter==="all" ? yantEntries : yantEntries.filter(([,y])=>y.category===filter);
  const rankMap = {}; ranked.forEach((r,i)=>{ rankMap[r.key]=i+1; });

  const displayList = (ranked.length>0 && tab==="recommended") ? ranked.map(r=>[r.key,r.yant]) : filtered;

  return (
    <div style={{ minHeight:"100vh", background: theme==="dark" ? DARK : "#F5F0E6", fontFamily:"Georgia,'Times New Roman',serif", color:WARM, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background: theme==="dark" ? `radial-gradient(ellipse at 15% 15%, rgba(201,168,76,0.05) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(201,168,76,0.04) 0%, transparent 55%), repeating-linear-gradient(0deg,transparent,transparent 50px,rgba(201,168,76,0.01) 50px,rgba(201,168,76,0.01) 51px), repeating-linear-gradient(90deg,transparent,transparent 50px,rgba(201,168,76,0.01) 50px,rgba(201,168,76,0.01) 51px)` : `radial-gradient(ellipse at 15% 15%, rgba(139,112,48,0.08) 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(139,112,48,0.06) 0%, transparent 55%)` }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:920, margin:"0 auto", padding:"0 20px", opacity:loaded?1:0, transition:"opacity 0.8s ease" }}>
      {/* Language Selector */}
      <div style={{ position:"fixed", top:16, right:16, zIndex:100 }}>
        {/* Sound Toggle Button */}
        <button onClick={toggleSound} style={{
          position:"fixed", top:16, left:16, zIndex:100,
          background: theme==="dark" ? DEEP : "#EDE8DC", border:`1px solid ${theme==="dark" ? SUB : "#D5D0C4"}`, color:soundOn?G:DIM,
          padding:"6px 12px", fontSize:11, cursor:"pointer", fontFamily:"Georgia,serif",
          display:"flex", alignItems:"center", gap:6, transition:"all 0.2s ease",
        }}>
          {soundOn ? "♪ On" : "♪ Off"}
        </button>

        {/* Theme Toggle Button */}
        <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{
          position:"fixed", top:16, left: 80, zIndex:100,
          background: theme==="dark"?DEEP:"#EDE8DC", border:`1px solid ${theme==="dark"?SUB:"#D5D0C4"}`,
          color: theme==="dark"?DIM:"#6A6050",
          padding:"6px 12px", fontSize:11, cursor:"pointer", fontFamily:"Georgia,serif",
        }}>
          {theme==="dark" ? "☀" : "☾"}
        </button>

        {/* Language Selector */}
        <button onClick={()=>setShowLang(!showLang)} style={{
          background: theme==="dark" ? DEEP : "#EDE8DC", border:`1px solid ${theme==="dark" ? SUB : "#D5D0C4"}`, color:theme==="dark" ? DIM : "#6A6050", padding:"6px 12px",
          fontSize:11, cursor:"pointer", fontFamily:"Georgia,serif", display:"flex", alignItems:"center", gap:6,
        }}>
          {LANGUAGES.find(l=>l.code===lang)?.flag} {lang.toUpperCase()}
        </button>
        {showLang && (
          <div style={{ position:"absolute", top:"100%", right:0, marginTop:4, background: theme==="dark" ? DEEP : "#EDE8DC", border:`1px solid ${theme==="dark" ? SUB : "#D5D0C4"}`, zIndex:101, minWidth:140 }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={()=>{setLang(l.code);setShowLang(false);}} style={{
                display:"block", width:"100%", background:lang===l.code?"rgba(201,168,76,0.1)":"transparent",
                border:"none", borderBottom:`1px solid ${theme==="dark" ? SUB : "#D5D0C4"}`, color:lang===l.code?G:(theme==="dark" ? DIM : "#6A6050"),
                padding:"8px 12px", fontSize:11, cursor:"pointer", fontFamily:"Georgia,serif",
                textAlign:"left",
              }}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

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
              <Btn small onClick={()=>setPhase("gallery")}>Practitioner Gallery</Btn>
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
                  {elName(QUESTIONS[currentQ].element)} · {elThai(QUESTIONS[currentQ].element)}
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
                        <div style={{ fontSize: 11, letterSpacing: 1 }}>{t(o.tKey)}</div>
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
                        {t(area.tKey)}
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
                {currentQ===QUESTIONS.length-1 ? t("reveal_yants") : t("continue_btn")}
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
                <div style={{ fontSize:9, letterSpacing:2, color:elementProfile.air > 0.6 ? WARM : DIM, marginTop:2 }}>{elThai("air")}</div>
              </div>
              {/* Fire - right */}
              <div style={{ position:"absolute", top:"50%", right:0, transform:"translateY(-50%)", textAlign:"center" }}>
                <div style={{ fontSize:24, color:ELEMENTS.fire.color, opacity:0.3 + elementProfile.fire * 0.7, transition:"opacity 0.6s ease" }}>{ELEMENTS.fire.symbol}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:elementProfile.fire > 0.6 ? WARM : DIM, marginTop:2 }}>{elThai("fire")}</div>
              </div>
              {/* Earth - bottom */}
              <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
                <div style={{ fontSize:24, color:ELEMENTS.earth.color, opacity:0.3 + elementProfile.earth * 0.7, transition:"opacity 0.6s ease" }}>{ELEMENTS.earth.symbol}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:elementProfile.earth > 0.6 ? WARM : DIM, marginTop:2 }}>{elThai("earth")}</div>
              </div>
              {/* Water - left */}
              <div style={{ position:"absolute", top:"50%", left:0, transform:"translateY(-50%)", textAlign:"center" }}>
                <div style={{ fontSize:24, color:ELEMENTS.water.color, opacity:0.3 + elementProfile.water * 0.7, transition:"opacity 0.6s ease" }}>{ELEMENTS.water.symbol}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:elementProfile.water > 0.6 ? WARM : DIM, marginTop:2 }}>{elThai("water")}</div>
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
                  <div style={{ fontSize:10, letterSpacing:2, color:el.color, width:52, textAlign:"right" }}>{elName(key)}</div>
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
                earth: t("reading_earth"),
                water: t("reading_water"),
                fire: t("reading_fire"),
                air: t("reading_air"),
              };
              const combos = {
                earth_water: t("combo_earth_water"),
                earth_fire: t("combo_earth_fire"),
                earth_air: t("combo_earth_air"),
                water_fire: t("combo_water_fire"),
                water_air: t("combo_water_air"),
                fire_air: t("combo_fire_air"),
              };
              const comboKey = [primary, secondary].sort().join("_");
              return (
                <div style={{ marginBottom:40 }}>
                  <p style={{ fontSize:15, lineHeight:1.85, color:MID, marginBottom:12 }}>
                    Your primary element is <span style={{ color:ELEMENTS[primary].color, fontStyle:"italic" }}>{elName(primary)} ({elThai(primary)})</span> with strong <span style={{ color:ELEMENTS[secondary].color, fontStyle:"italic" }}>{elName(secondary)} ({elThai(secondary)})</span> influence.
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
                  {ranked.slice(0,3).map((r, i) => {
                    const isPicked = journey[r.key] === "next";
                    const anyPicked = Object.values(journey).some(v=>v==="next");
                    const highlight = isPicked || (!anyPicked && i===0);
                    return (
                    <div key={r.key} onClick={()=>setDetail(r.key)} style={{
                      border:`${isPicked?2:1}px solid ${highlight ? G : SUB}`,
                      background: highlight ? "rgba(201,168,76,0.08)" : "transparent",
                      padding:"24px 20px", cursor:"pointer",
                      display:"flex", gap:20, alignItems:"center", textAlign:"left",
                      transition:"all 0.2s ease",
                    }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor=G; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor=highlight?G:SUB; }}
                    >
                      <div style={{ flexShrink:0, textAlign:"center" }}>
                        <div style={{ fontSize:9, letterSpacing:2, color:G, marginBottom:6, opacity:0.7 }}>#{i+1}</div>
                        <div style={{ width:100, height:100, color: i===0 ? G : MID }} dangerouslySetInnerHTML={{ __html: r.yant.svg }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:15, color:WARM, marginBottom:2 }}>{r.yant.name}</div>
                        <div style={{ fontSize:11, color:G, letterSpacing:1, marginBottom:6 }}>{r.yant.thai} · {r.yant.meaning}</div>
                        <div style={{ fontSize:11, color:DIM, lineHeight:1.7 }}>{r.yant.description.slice(0, 160)}...</div>
                        <div style={{ marginTop:8, display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                          <span style={{ fontSize:8, letterSpacing:2, textTransform:"uppercase", color:ELEMENTS[r.yant.element]?.color || DIM }}>{ELEMENTS[r.yant.element]?.symbol} {elName(r.yant.element)}</span>
                          <span style={{ fontSize:8, letterSpacing:1, color:DIM }}>· {r.yant.placement}</span>
                          <button onClick={(e) => { e.stopPropagation(); setBodyPreview(r.key); }} style={{
                            marginLeft:"auto", background:"transparent", border:`1px solid ${DIM}`, color:DIM, padding:"4px 10px",
                            fontSize:8, letterSpacing:1, textTransform:"uppercase", cursor:"pointer", fontFamily:"Georgia,serif",
                            transition:"all 0.2s ease",
                          }}
                            onMouseEnter={e=>{ e.currentTarget.style.borderColor=G; e.currentTarget.style.color=G; }}
                            onMouseLeave={e=>{ e.currentTarget.style.borderColor=DIM; e.currentTarget.style.color=DIM; }}
                          >{t("try_it_on")}</button>
                          <button onClick={(e) => { e.stopPropagation(); setYantStatus(r.key, "next"); }} style={{
                            background: isPicked ? G : "transparent",
                            border:`1px solid ${G}`, color: isPicked ? "#0D0B07" : G, padding:"4px 10px",
                            fontSize:8, letterSpacing:1, textTransform:"uppercase", cursor:"pointer", fontFamily:"Georgia,serif",
                            transition:"all 0.2s ease",
                          }}>{isPicked ? "★ My Choice" : "Pick This One"}</button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
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
                    <span key={o.id} style={{ fontSize:10, color:DIM, letterSpacing:1 }}>{o.icon} {t(o.tKey)}</span>
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
                  const offeringsList = OFFERINGS.filter(o => offerings.has(o.id)).map(o => t(o.tKey)).join(", ");
                  const text = `✦ Sak Yant Oracle — My Manifestation ✦\n\nPrimary Element: ${elName(primary)} (${elThai(primary)})\nSecondary Element: ${elName(secondary)} (${elThai(secondary)})\n\nMy Offerings: ${offeringsList || "None selected"}\n\nTop Recommended Yants:\n${top3}\n\n— Generated at sakyantoracle.com`;
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
            <div style={{ marginTop:12 }}>
              <button
                onClick={() => {
                  try {
                    const payload = { a: answers, b: bodyAreas, d: discretion, o: [...offerings] };
                    const json = JSON.stringify(payload);
                    const b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
                    const url = `${window.location.origin}${window.location.pathname}?r=${b64}`;
                    navigator.clipboard.writeText(url).then(()=>{
                      setShareCopied(true);
                      setTimeout(()=>setShareCopied(false), 2200);
                    });
                  } catch(e) {}
                }}
                style={{
                  background:"none", border:`1px solid ${G}`, color:G, padding:"10px 24px",
                  fontSize:9, letterSpacing:3, textTransform:"uppercase", cursor:"pointer",
                  fontFamily:"Georgia,serif", transition:"all 0.18s ease",
                }}
              >{shareCopied ? "✓ Link Copied" : "Copy Shareable Link"}</button>
            </div>

            {isShared && (
              <div style={{ marginTop:40, padding:"22px 20px", border:`1px solid ${G}`, background:"rgba(201,168,76,0.04)", maxWidth:520, marginLeft:"auto", marginRight:"auto" }}>
                <div style={{ fontSize:9, letterSpacing:3, color:G, textTransform:"uppercase", marginBottom:10 }}>For Practitioners</div>
                <div style={{ fontSize:12, color:WARM, fontFamily:"Georgia,serif", lineHeight:1.6, marginBottom:14 }}>
                  This reading was generated by Sak Yant Oracle — a guided experience that helps clients discover which sacred yants align with their path before they visit an ajarn. If you're a practitioner interested in offering this to your clients, let's talk.
                </div>
                <a href="https://m.me/jor.allen.2025" target="_blank" rel="noopener noreferrer" style={{
                  display:"inline-block", border:`1px solid ${G}`, color:G, padding:"10px 22px",
                  fontSize:9, letterSpacing:3, textTransform:"uppercase", textDecoration:"none",
                  fontFamily:"Georgia,serif",
                }}>Message on Facebook</a>
              </div>
            )}
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
                  {ranked.length>0 ? t("your_yant_library") : t("design_library")}
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
                  }}>{t==="recommended" ? t("for_you") : `All ${yantEntries.length} Designs`}</button>
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
                          {yant.element && ELEMENTS[yant.element] && <div style={{ fontSize:8, letterSpacing:1, color:ELEMENTS[yant.element].color }}>{ELEMENTS[yant.element].symbol} {elName(yant.element)}</div>}
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
                        const primaryEl = sorted.length > 0 ? elName(sorted[0][0]) : "";
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
                        const primaryEl = sorted.length > 0 ? `Primary Element: ${elName(sorted[0][0])}` : "";
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
                  {Object.values(journey).filter(v=>v==="have").length} received · {Object.values(journey).filter(v=>v==="next").length} planned · {Object.values(journey).filter(v=>v===t("someday_word")).length} someday
                </div>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <Btn small onClick={()=>setPhase("library")}>← Library</Btn>
                <Btn small onClick={()=>setPhase("collage")}>Collection</Btn>
              </div>
            </div>

            {/* Journey Filters */}
            <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
              {[["all",t("filter_all")], ["have",t("filter_received")], ["next",t("stat_getting_next")], [t("someday_word"),t("stat_someday")]].map(([val, label])=>(
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
                const statusLabels = { have: t("stat_received"), next: t("stat_getting_next"), someday: t("stat_someday") };
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
                          <span style={{ fontSize:8, letterSpacing:2, textTransform:"uppercase", border:`1px solid ${ELEMENTS[yant.element].color}`, color:ELEMENTS[yant.element].color, padding:"2px 6px" }}>{ELEMENTS[yant.element].symbol} {elName(yant.element)}</span>
                        )}
                        {yant.traits.slice(0,4).map(t=>(
                          <span key={t} style={{ fontSize:8, letterSpacing:1, textTransform:"uppercase", border:`1px solid rgba(201,168,76,0.15)`, color:G, padding:"2px 6px", opacity:0.7 }}>{t}</span>
                        ))}
                      </div>

                      {/* Status buttons */}
                      <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                        {["have","next",t("someday_word")].map(s => (
                          <button key={s} onClick={()=>setYantStatus(key, s)} style={{
                            background: status===s ? (statusColors[s]+"22") : "transparent",
                            border:`1px solid ${status===s ? statusColors[s] : SUB}`,
                            color: status===s ? statusColors[s] : DIM,
                            padding:"4px 10px", fontSize:8, letterSpacing:2, textTransform:"uppercase",
                            cursor:"pointer", fontFamily:"Georgia,serif", transition:"all 0.15s ease",
                          }}>{s==="have"?t("have_it"):s==="next"?t("next_btn"):s===t("someday_word")?t("stat_someday"):s}</button>
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
                            placeholder={t("note_placeholder")}
                            style={{
                              width:"100%", background:"rgba(255,255,255,0.03)", border:`1px solid ${SUB}`,
                              color:WARM, padding:"10px 12px", fontSize:12, lineHeight:1.6,
                              fontFamily:"Georgia,serif", resize:"vertical", minHeight:60,
                              outline:"none",
                            }}
                          />
                          <div style={{ fontSize:9, color:DIM, marginTop:4, letterSpacing:1 }}>{t("note_save_hint")}</div>
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
                    [t("stat_received"), Object.values(journey).filter(v=>v==="have").length, "#4A7A5A"],
                    [t("stat_getting_next"), Object.values(journey).filter(v=>v==="next").length, G],
                    [t("stat_someday"), Object.values(journey).filter(v=>v===t("someday_word")).length, "#5B7B8A"],
                    [t("stat_total"), Object.keys(journey).length, WARM],
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


        {/* GALLERY */}
        {phase==="gallery" && (
          <div style={{ paddingTop:60, paddingBottom:80, textAlign:"center", maxWidth:620, margin:"0 auto" }}>
            <div style={{ fontSize:10, letterSpacing:6, color:G, marginBottom:28, textTransform:"uppercase" }}>✦ Sacred Artistry</div>
            <h2 style={{ fontSize:22, fontWeight:"normal", color:WARM, margin:"0 0 12px", fontStyle:"italic" }}>Practitioner Gallery</h2>
            <p style={{ fontSize:13, lineHeight:1.8, color:DIM, maxWidth:440, margin:"0 auto 40px" }}>
              A curated collection of real Sak Yant work from verified ajarn masters. Coming soon.
            </p>
            
            {/* Placeholder grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:14, marginBottom:40 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{
                  aspectRatio:"1", border:`1px dashed ${SUB}`, display:"flex", alignItems:"center", justifyContent:"center",
                  background:"rgba(201,168,76,0.02)",
                }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:24, color:G, opacity:0.2, marginBottom:8 }}>✦</div>
                    <div style={{ fontSize:9, color:DIM, letterSpacing:2, textTransform:"uppercase" }}>Coming Soon</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ border:`1px solid ${G}`, padding:"28px 24px", background:"rgba(201,168,76,0.03)", marginBottom:28 }}>
              <div style={{ fontSize:10, letterSpacing:4, color:G, textTransform:"uppercase", marginBottom:12 }}>✦ For Practitioners</div>
              <p style={{ fontSize:13, lineHeight:1.8, color:DIM, margin:"0 0 16px" }}>
                Are you a Sak Yant ajarn or monk? Showcase your sacred work to seekers worldwide.
              </p>
              <p style={{ fontSize:11, color:DIM, letterSpacing:1 }}>
                Contact: sakyantoracle@gmail.com
              </p>
            </div>
            
            <Btn small onClick={()=>setPhase("intro")}>← Back to Home</Btn>
          </div>
        )}

            {detail && YANTS[detail] && (
        <Modal yantKey={detail} yant={YANTS[detail]} inCollage={collage.has(detail)} onToggle={toggleCollage} onClose={()=>setDetail(null)} currentStatus={journey[detail]} onSetStatus={setYantStatus} setBodyPreview={setBodyPreview} />
      )}

      {bodyPreview && YANTS[bodyPreview] && (
        <BodyPreview yant={YANTS[bodyPreview]} onClose={()=>setBodyPreview(null)} />
      )}

      {qrData && (
        <div style={{ position:"fixed", inset:0, background:"rgba(13,11,7,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 }}>
          <div style={{ background:DEEP, border:`1px solid ${G}`, padding:"32px", textAlign:"center", maxWidth:320 }}>
            <div style={{ fontSize:10, letterSpacing:4, color:G, marginBottom:16, textTransform:"uppercase" }}>✦ QR Code</div>
            <img src={qrData} alt="QR Code" style={{ width:256, height:256, marginBottom:16 }} />
            <p style={{ fontSize:12, color:DIM, marginBottom:20, lineHeight:1.6 }}>Your ajarn can scan this to see your reading</p>
            <button onClick={()=>setQrData(null)} style={{
              background:"transparent", border:`1px solid ${SUB}`, color:DIM, padding:"8px 16px",
              fontSize:10, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", fontFamily:"Georgia,serif"
            }}>Close</button>
          </div>
        </div>
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
