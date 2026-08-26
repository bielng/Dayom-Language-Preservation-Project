// ═══════════════════════════════════════════════════════════════════════
//  DAYOM AI CHAT — ULTIMATE TEST SUITE (100+ cases)
//  Run: import then call runDayomTests() in browser console
// ═══════════════════════════════════════════════════════════════════════

import { loadKnowledgeBase, askDayomAi } from "./chatKnowledge.js";

const TEST_CASES = [
  // ═══════════════════════════════════════════════════════════════════
  //  EXACT MATCHES (1–20)
  // ═══════════════════════════════════════════════════════════════════
  { q: "How do I say hello in Nuer?", mustInclude: ["Nuer", "hello"], label: "T01-exact-translate-nuer" },
  { q: "What is water in Dinka?", mustInclude: ["Dinka", "water"], label: "T02-exact-translate-dinka" },
  { q: "What does Malɛ mean?", mustInclude: ["Malɛ"], label: "T03-exact-reverse-nuer" },
  { q: "Teach me a Dinka greeting", mustInclude: ["Dinka"], label: "T04-exact-semantic-dinka" },
  { q: "How do I say father in Nuer?", mustInclude: ["Nuer", "father"], label: "T05-exact-family-nuer" },
  { q: "What is 'water' in Dinka?", mustInclude: ["Dinka", "water"], label: "T06-exact-quoted-dinka" },
  { q: "Translate hello to Nuer", mustInclude: ["Nuer"], label: "T07-exact-translate-syntax" },
  { q: "Tell me how to say goodbye in Dinka", mustInclude: ["Dinka"], label: "T08-exact-tell-me-syntax" },
  { q: "Define hello", mustInclude: ["hello"], label: "T09-exact-define" },
  { q: "What is the meaning of water?", mustInclude: ["water"], label: "T10-exact-meaning-of" },
  { q: "How do you say thank you in Nuer?", mustInclude: ["Nuer"], label: "T11-exact-thank-you" },
  { q: "What is mother in Dinka?", mustInclude: ["Dinka", "mother"], label: "T12-exact-mother" },
  { q: "Translate child to Dinka", mustInclude: ["Dinka"], label: "T13-exact-child" },
  { q: "How to say good morning in Nuer", mustInclude: ["Nuer"], label: "T14-exact-good-morning" },
  { q: "What does thok mean?", mustInclude: ["thok"], label: "T15-exact-thok" },
  { q: "Show me water in Dinka", mustInclude: ["Dinka"], label: "T16-exact-show-me" },
  { q: "Give me hello in Nuer", mustInclude: ["Nuer"], label: "T17-exact-give-me" },
  { q: "What is 'father' in Dinka?", mustInclude: ["Dinka", "father"], label: "T18-exact-quoted-father" },
  { q: "How do I say 'goodbye' in Nuer?", mustInclude: ["Nuer"], label: "T19-exact-quoted-goodbye" },
  { q: "What does ciɛŋ mean?", mustInclude: ["ciɛŋ"], label: "T20-exact-cieng" },

  // ═══════════════════════════════════════════════════════════════════
  //  TYPOS / FUZZY MATCHING (21–40)
  // ═══════════════════════════════════════════════════════════════════
  { q: "How do I say helo in Nuer?", mustInclude: ["Nuer"], label: "T21-fuzzy-helo" },
  { q: "What is wter in Dinka?", mustInclude: ["Dinka"], label: "T22-fuzzy-wter" },
  { q: "How do I say gretings in Nuer?", mustInclude: ["Nuer"], label: "T23-fuzzy-gretings" },
  { q: "What is fther in Dinka?", mustInclude: ["Dinka"], label: "T24-fuzzy-fther" },
  { q: "How do I say thak you in Nuer?", mustInclude: ["Nuer"], label: "T25-fuzzy-thak" },
  { q: "What is chld in Dinka?", mustInclude: ["Dinka"], label: "T26-fuzzy-chld" },
  { q: "How do I say godby in Nuer?", mustInclude: ["Nuer"], label: "T27-fuzzy-godby" },
  { q: "What is wter in Dinka?", mustInclude: ["Dinka"], label: "T28-fuzzy-water-typo" },
  { q: "How do I say helo in Dinka?", mustInclude: ["Dinka"], label: "T29-fuzzy-hello-dinka" },
  { q: "What is mther in Nuer?", mustInclude: ["Nuer"], label: "T30-fuzzy-mother" },
  { q: "How do I say by in Nuer?", mustInclude: ["Nuer"], label: "T31-fuzzy-by" },
  { q: "What is frend in Dinka?", mustInclude: ["Dinka"], label: "T32-fuzzy-friend" },
  { q: "How do I say hous in Nuer?", mustInclude: ["Nuer"], label: "T33-fuzzy-house" },
  { q: "What is animl in Dinka?", mustInclude: ["Dinka"], label: "T34-fuzzy-animal" },
  { q: "How do I say colr in Nuer?", mustInclude: ["Nuer"], label: "T35-fuzzy-color" },
  { q: "What is numbr in Dinka?", mustInclude: ["Dinka"], label: "T36-fuzzy-number" },
  { q: "How do I say tim in Nuer?", mustInclude: ["Nuer"], label: "T37-fuzzy-time" },
  { q: "What is bdy in Dinka?", mustInclude: ["Dinka"], label: "T38-fuzzy-body" },
  { q: "How do I say emtion in Nuer?", mustInclude: ["Nuer"], label: "T39-fuzzy-emotion" },
  { q: "What is travl in Dinka?", mustInclude: ["Dinka"], label: "T40-fuzzy-travel" },

  // ═══════════════════════════════════════════════════════════════════
  //  PARTIAL NATIVE WORDS (41–50)
  // ═══════════════════════════════════════════════════════════════════
  { q: "What does mal mean in Nuer?", mustInclude: ["Nuer"], label: "T41-partial-mal" },
  { q: "What does ci mean?", mustInclude: ["ciɛŋ"], label: "T42-partial-ci" },
  { q: "What does thok mean?", mustInclude: ["thok"], label: "T43-partial-thok" },
  { q: "What does naath mean?", mustInclude: ["naath"], label: "T44-partial-naath" },
  { q: "What does malɛ mean?", mustInclude: ["malɛ"], label: "T45-partial-male" },
  { q: "What does ciɛ mean?", mustInclude: ["ciɛŋ"], label: "T46-partial-cie" },
  { q: "What does th mean?", mustInclude: ["don't have"], label: "T47-partial-th" },
  { q: "What does ka mean?", mustInclude: ["Nuer"], label: "T48-partial-ka" },
  { q: "What does lu mean?", mustInclude: ["Nuer"], label: "T49-partial-lu" },
  { q: "What does ri mean?", mustInclude: ["Nuer"], label: "T50-partial-ri" },

  // ═══════════════════════════════════════════════════════════════════
  //  SEMANTIC / BROAD QUERIES (51–70)
  // ═══════════════════════════════════════════════════════════════════
  { q: "How do I say a greeting in Nuer?", mustInclude: ["Nuer"], label: "T51-semantic-greeting" },
  { q: "What is food in Dinka?", mustInclude: ["Dinka"], label: "T52-semantic-food" },
  { q: "How do I say a color in Nuer?", mustInclude: ["Nuer"], label: "T53-semantic-color" },
  { q: "What is family in Dinka?", mustInclude: ["Dinka"], label: "T54-semantic-family" },
  { q: "How do I say an animal in Nuer?", mustInclude: ["Nuer"], label: "T55-semantic-animal" },
  { q: "What is a number in Dinka?", mustInclude: ["Dinka"], label: "T56-semantic-number" },
  { q: "How do I say something about time in Nuer?", mustInclude: ["Nuer"], label: "T57-semantic-time" },
  { q: "What is a body part in Dinka?", mustInclude: ["Dinka"], label: "T58-semantic-body" },
  { q: "How do I say an emotion in Nuer?", mustInclude: ["Nuer"], label: "T59-semantic-emotion" },
  { q: "What is travel in Dinka?", mustInclude: ["Dinka"], label: "T60-semantic-travel" },
  { q: "How do I say weather in Nuer?", mustInclude: ["Nuer"], label: "T61-semantic-weather" },
  { q: "What is work in Dinka?", mustInclude: ["Dinka"], label: "T62-semantic-work" },
  { q: "How do I say religion in Nuer?", mustInclude: ["Nuer"], label: "T63-semantic-religion" },
  { q: "What is health in Dinka?", mustInclude: ["Dinka"], label: "T64-semantic-health" },
  { q: "How do I say school in Nuer?", mustInclude: ["Nuer"], label: "T65-semantic-school" },
  { q: "What is nature in Dinka?", mustInclude: ["Dinka"], label: "T66-semantic-nature" },
  { q: "How do I say direction in Nuer?", mustInclude: ["Nuer"], label: "T67-semantic-direction" },
  { q: "What is size in Dinka?", mustInclude: ["Dinka"], label: "T68-semantic-size" },
  { q: "How do I say quality in Nuer?", mustInclude: ["Nuer"], label: "T69-semantic-quality" },
  { q: "What is clothing in Dinka?", mustInclude: ["Dinka"], label: "T70-semantic-clothing" },

  // ═══════════════════════════════════════════════════════════════════
  //  GRAMMAR QUESTIONS (71–80)
  // ═══════════════════════════════════════════════════════════════════
  { q: "What is the plural of child in Nuer?", mustInclude: ["Nuer"], label: "T71-grammar-plural" },
  { q: "How do you conjugate go in Dinka?", mustInclude: ["Dinka"], label: "T72-grammar-conjugate" },
  { q: "What is the past tense of eat in Nuer?", mustInclude: ["Nuer"], label: "T73-grammar-past" },
  { q: "How do you form sentences in Dinka?", mustInclude: ["Dinka"], label: "T74-grammar-sentences" },
  { q: "What are Nuer pronouns?", mustInclude: ["Nuer"], label: "T75-grammar-pronouns" },
  { q: "How do you make plural in Dinka?", mustInclude: ["Dinka"], label: "T76-grammar-plural-dinka" },
  { q: "What is the verb structure in Nuer?", mustInclude: ["Nuer"], label: "T77-grammar-verb" },
  { q: "How do adjectives work in Dinka?", mustInclude: ["Dinka"], label: "T78-grammar-adjective" },
  { q: "What is the future tense in Nuer?", mustInclude: ["Nuer"], label: "T79-grammar-future" },
  { q: "How do you negate in Dinka?", mustInclude: ["Dinka"], label: "T80-grammar-negate" },

  // ═══════════════════════════════════════════════════════════════════
  //  COMPARISON & CULTURE (81–90)
  // ═══════════════════════════════════════════════════════════════════
  { q: "Compare hello in Nuer and Dinka", mustInclude: ["Nuer", "Dinka"], label: "T81-compare-hello" },
  { q: "What is the difference between water in Nuer and Dinka?", mustInclude: ["Nuer", "Dinka"], label: "T82-compare-water" },
  { q: "Tell me about Nuer greetings", mustInclude: ["Nuer"], label: "T83-culture-greetings" },
  { q: "What do you know about Dinka culture?", mustInclude: ["Dinka"], label: "T84-culture-dinka" },
  { q: "Compare father in both languages", mustInclude: ["Nuer", "Dinka"], label: "T85-compare-father" },
  { q: "Tell me about Nuer family words", mustInclude: ["Nuer"], label: "T86-culture-family" },
  { q: "What is the difference between Nuer and Dinka?", mustInclude: ["Nuer", "Dinka"], label: "T87-compare-languages" },
  { q: "Tell me about Dinka traditions", mustInclude: ["Dinka"], label: "T88-culture-traditions" },
  { q: "Compare goodbye in Nuer and Dinka", mustInclude: ["Nuer", "Dinka"], label: "T89-compare-goodbye" },
  { q: "What do you know about Nuer people?", mustInclude: ["Nuer"], label: "T90-culture-people" },

  // ═══════════════════════════════════════════════════════════════════
  //  AUDIO / PRONUNCIATION (91–95)
  // ═══════════════════════════════════════════════════════════════════
  { q: "How do you pronounce thok naath?", mustInclude: ["thok"], label: "T91-audio-thok" },
  { q: "How do you say hello in Nuer with audio?", mustInclude: ["Nuer"], label: "T92-audio-hello" },
  { q: "Pronounce water in Dinka", mustInclude: ["Dinka"], label: "T93-audio-water" },
  { q: "How does Malɛ sound?", mustInclude: ["Malɛ"], label: "T94-audio-male" },
  { q: "Listen to goodbye in Nuer", mustInclude: ["Nuer"], label: "T95-audio-goodbye" },

  // ═══════════════════════════════════════════════════════════════════
  //  FOLLOW-UPS (96–100)
  // ═══════════════════════════════════════════════════════════════════
  { q: "How do I say hello in Nuer?", mustInclude: ["Nuer"], label: "T96-followup-base" },
  { q: "And in Dinka?", mustInclude: ["Dinka"], label: "T97-followup-switch" },
  { q: "What about goodbye?", mustInclude: ["goodbye"], label: "T98-followup-term" },
  { q: "And in Nuer?", mustInclude: ["Nuer"], label: "T99-followup-back" },
  { q: "How about thank you?", mustInclude: ["thank"], label: "T100-followup-thank" },

  // ═══════════════════════════════════════════════════════════════════
  //  EDGE CASES (101–110)
  // ═══════════════════════════════════════════════════════════════════
  { q: "asdfghjkl", mustInclude: ["don't have"], label: "T101-edge-gibberish" },
  { q: "", mustInclude: ["Ask me"], label: "T102-edge-empty" },
  { q: "What languages do you know?", mustInclude: ["Nuer", "Dinka"], label: "T103-edge-languages" },
  { q: "How do I say hello", mustInclude: ["hello"], label: "T104-edge-no-language" },
  { q: "hello", mustInclude: ["hello"], label: "T105-edge-single-word" },
  { q: "malɛ", mustInclude: ["malɛ"], label: "T106-edge-single-native" },
  { q: "What is the meaning of life in Dinka?", mustInclude: ["Dinka"], label: "T107-edge-abstract" },
  { q: "How do I say I love you in Nuer?", mustInclude: ["Nuer"], label: "T108-edge-phrase" },
  { q: "What is big in Dinka?", mustInclude: ["Dinka"], label: "T109-edge-quality" },
  { q: "How do I say rain in Nuer?", mustInclude: ["Nuer"], label: "T110-edge-weather" },

  // ═══════════════════════════════════════════════════════════════════
  //  STATIC INTENTS (111–120)
  // ═══════════════════════════════════════════════════════════════════
  { q: "Hi", mustInclude: ["Hello"], label: "T111-static-hi" },
  { q: "Hello there", mustInclude: ["Hello"], label: "T112-static-hello" },
  { q: "Thanks", mustInclude: ["welcome"], label: "T113-static-thanks" },
  { q: "Thank you very much", mustInclude: ["welcome"], label: "T114-static-thank-you" },
  { q: "Bye", mustInclude: ["Goodbye"], label: "T115-static-bye" },
  { q: "Goodbye", mustInclude: ["Goodbye"], label: "T116-static-goodbye" },
  { q: "Help", mustInclude: ["How to use"], label: "T117-static-help" },
  { q: "How do you work?", mustInclude: ["How to use"], label: "T118-static-how-work" },
  { q: "What can I ask?", mustInclude: ["How to use"], label: "T119-static-what-ask" },
  { q: "What languages?", mustInclude: ["Nuer"], label: "T120-static-what-langs" },

  // ═══════════════════════════════════════════════════════════════════
  //  ADVANCED SEMANTIC (121–130)
  // ═══════════════════════════════════════════════════════════════════
  { q: "How do I say something to eat in Nuer?", mustInclude: ["Nuer"], label: "T121-adv-eat" },
  { q: "What is a relative in Dinka?", mustInclude: ["Dinka"], label: "T122-adv-relative" },
  { q: "How do I say something hot in Nuer?", mustInclude: ["Nuer"], label: "T123-adv-hot" },
  { q: "What is a vehicle in Dinka?", mustInclude: ["Dinka"], label: "T124-adv-vehicle" },
  { q: "How do I say a feeling in Nuer?", mustInclude: ["Nuer"], label: "T125-adv-feeling" },
  { q: "What is a tool in Dinka?", mustInclude: ["Dinka"], label: "T126-adv-tool" },
  { q: "How do I say a season in Nuer?", mustInclude: ["Nuer"], label: "T127-adv-season" },
  { q: "What is a place in Dinka?", mustInclude: ["Dinka"], label: "T128-adv-place" },
  { q: "How do I say a day in Nuer?", mustInclude: ["Nuer"], label: "T129-adv-day" },
  { q: "What is a month in Dinka?", mustInclude: ["Dinka"], label: "T130-adv-month" },
];

async function runTests() {
  console.log("🚀 DAYOM AI — ULTIMATE ROBUSTNESS TEST SUITE");
  console.log("═══════════════════════════════════════════════════════\n");
  console.log("Loading knowledge base + building TF-IDF index…");
  const startTime = performance.now();
  await loadKnowledgeBase();
  const loadTime = performance.now() - startTime;
  console.log(`✅ KB loaded & indexed in ${loadTime.toFixed(0)}ms\n`);

  let passed = 0, failed = 0, skipped = 0;
  const failures = [];
  const resultsByCategory = {};

  for (const test of TEST_CASES) {
    const cat = test.label.split("-")[1] || "unknown";
    if (!resultsByCategory[cat]) resultsByCategory[cat] = { passed: 0, failed: 0 };

    const result = await askDayomAi(test.q);
    const text = result.text.toLowerCase();
    const ok = test.mustInclude.every(w => text.includes(w.toLowerCase()));

    if (ok) {
      passed++;
      resultsByCategory[cat].passed++;
      console.log(`✅ ${test.label}: "${test.q.slice(0, 50)}${test.q.length > 50 ? "…" : ""}"`);
    } else {
      failed++;
      resultsByCategory[cat].failed++;
      console.log(`❌ ${test.label}: "${test.q}"`);
      console.log(`   Expected: ${test.mustInclude.join(", ")}`);
      console.log(`   Got: ${result.text.slice(0, 100)}${result.text.length > 100 ? "…" : ""}`);
      failures.push({ ...test, got: result.text, meta: result.meta });
    }
  }

  const total = passed + failed;
  const rate = total ? ((passed / total) * 100).toFixed(1) : 0;

  console.log("\n═══════════════════════════════════════════════════════");
  console.log(`📊 RESULTS: ${passed} passed · ${failed} failed · ${total} total`);
  console.log(`   Success rate: ${rate}%`);
  console.log(`   Load time: ${loadTime.toFixed(0)}ms`);
  console.log("\n📁 By category:");
  for (const [cat, stats] of Object.entries(resultsByCategory)) {
    const catRate = ((stats.passed / (stats.passed + stats.failed)) * 100).toFixed(0);
    console.log(`   ${cat}: ${stats.passed}/${stats.passed + stats.failed} (${catRate}%)`);
  }

  if (failures.length) {
    console.log("\n🔧 FAILED CASES:");
    failures.forEach(f => console.log(`   · ${f.label}: "${f.q}"`));
  }

  return { passed, failed, total, rate, loadTime, failures, resultsByCategory };
}

if (typeof window !== "undefined") {
  window.runDayomTests = runTests;
  console.log("💡 Call runDayomTests() in the console to run the full suite.");
}

export { runTests };
