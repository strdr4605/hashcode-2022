const fs = require("fs");
const fileName = process.argv[2];
const file = fs.readFileSync(fileName, { encoding: "ascii" });
const data = file.split("\n");

// console.log(data);
const [c, p] = data.shift().split(" ");
// console.log(c, p);
const cO = {};
const skillObj = {};
for (let i = 0; i < c; i++) {
  const [conName, sC] = data.shift().split(" ");
  const skills = {};
  for (let j = 0; j < sC; j++) {
    const [skillName, l] = data.shift().split(" ");
    skills[skillName] = l;
    if (!skillObj[skillName]) {
      skillObj[skillName] = [[conName, l]];
    } else {
      skillObj[skillName].push([conName, l]);
    }
  }
  cO[conName] = skills;
}

const pO = {};
for (let i = 0; i < p; i++) {
  const [pN, pD, pS, pB, pR] = data.shift().split(" ");
  const proj = {
    n: pN,
    d: pD,
    s: pS,
    b: pB,
  };
  const roles = [];
  for (let j = 0; j < pR; j++) {
    const [sN, l] = data.shift().split(" ");
    roles.push([sN, +l]);
  }
  proj["skills"] = roles;
  pO[pN] = proj;
}

// console.log(JSON.stringify(cO, null, 2));
// console.log(JSON.stringify(pO, null, 2));
// console.log(JSON.stringify(skillObj, null, 2));

// console.log(p);

const projList = Object.keys(pO);

const finalProjs = [];

for (const proj of projList) {
  let currentProjContribs = [];
  for (const [skillName, l] of pO[proj].skills) {
    const contribIndex = skillObj[skillName].findIndex(
      ([contribName, contribL]) => l <= contribL
    );
    const contrib = skillObj[skillName][contribIndex];
    skillObj[skillName].splice(contribIndex, 1);
    if (!contrib) {
      skillObj[skillName].push(...currentProjContribs);
      currentProjContribs = [];
      break;
    }
    currentProjContribs.push(contrib);
  }
  // console.log({ proj, currentProjContribs });
  finalProjs.push([proj, currentProjContribs]);
}

const finalProjs2 = finalProjs.filter(([p, contribs]) => contribs.length);
// console.log(JSON.stringify(finalProjs2, null, 2));

const output = finalProjs2.map(
  ([pName, contribs]) => `${pName}\n${contribs.map((c) => c[0]).join(" ")}`
);
console.log(finalProjs2.length);
console.log(output.join("\n"));
