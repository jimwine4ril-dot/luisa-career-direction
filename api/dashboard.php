<?php

declare(strict_types=1);

require __DIR__ . '/helpers.php';

luisa_start_session();
luisa_require_authenticated();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    luisa_response(405, ['error' => 'Method not allowed.']);
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
?>
<div class="mentor-dashboard" data-dashboard>
  <div class="mentor-dashboard-header">
    <div>
      <p class="section-kicker">Private Workspace</p>
      <h2>Luisa's planning workspace</h2>
    </div>
    <button class="button button-quiet" type="button" data-lock-dashboard>Lock</button>
  </div>

  <div class="mentor-grid">
    <article class="mentor-card wide-card baseline-card">
      <p class="section-kicker">Wednesday Baseline</p>
      <h3>Career triage and positioning meeting</h3>
      <p class="mentor-lead">
        Core diagnosis: Luisa is not underqualified. She is mispositioned. The CV contains strong ingredients,
        but it is currently telling too many stories at once.
      </p>
      <blockquote>
        Luisa is a First Class Biomedical Science graduate with strong patient-facing and administrative
        healthcare experience. The aim is to shape that into a clear patient-facing diagnostics,
        clinical research, healthcare science, or imaging pathway with progression.
      </blockquote>
      <div class="output-grid">
        <span>Agree primary direction</span>
        <span>Agree backup direction</span>
        <span>Identify exact job titles</span>
        <span>Set four-week sprint</span>
      </div>
    </article>

    <article class="mentor-card">
      <h3>Opening Frame</h3>
      <p>
        Luisa's CV is not lacking experience or ability. The issue is that it is currently carrying
        too many different stories.
      </p>
      <p>
        This conversation is for deciding which pathway Luisa is aiming for, what roles are realistic now,
        and what the next four weeks should look like.
      </p>
    </article>

    <article class="mentor-card">
      <h3>CV Snapshot</h3>
      <ul class="question-list">
        <li>5-page Word-exported CV dated June 2026.</li>
        <li>First-Class Biomedical Science, IBMS-accredited programme, Salford University.</li>
        <li>Florence carer/support worker from February 2026 to present.</li>
        <li>InHealth Patient Care Advisor from December 2025 to April 2026.</li>
        <li>Cygnet Lodge Mental Health Support Worker from March 2023 to September 2025.</li>
        <li>Axcis SEN teaching assistant and Tritek PM/BA trainee add useful communication and process evidence.</li>
        <li>Training includes lung cancer screening communication and Very Brief Advice on Smoking.</li>
      </ul>
    </article>

    <article class="mentor-card">
      <h3>Career Diagnosis</h3>
      <div class="swor-grid">
        <div>
          <h4>Strengths</h4>
          <ul>
            <li>First Class IBMS-accredited Biomedical Science degree</li>
            <li>Patient-facing care, support, and mental health experience</li>
            <li>InHealth patient-advisor and cancer-service exposure</li>
            <li>Clinical data, appointment, PAS, and confidentiality experience</li>
          </ul>
        </div>
        <div>
          <h4>Risks</h4>
          <ul>
            <li>CV presents too many identities at once</li>
            <li>Random NHS admin applications may become another cul-de-sac</li>
            <li>Training could become a hiding place if applications stall</li>
          </ul>
        </div>
      </div>
    </article>

    <article class="mentor-card wide-card">
      <h3>Luisa's Route Options</h3>
      <div class="route-table" role="table" aria-label="Route ranking">
        <div class="route-row route-head" role="row">
          <span>Rank</span><span>Route</span><span>What it means</span><span>Why</span>
        </div>
        <div class="route-row" role="row">
          <span>1</span><strong>Imaging / Radiology</strong>
          <span>Best emotional fit</span>
          <span>Original radiography interest; patient contact, science, technology, progression, NHS identity.</span>
        </div>
        <div class="route-row" role="row">
          <span>2</span><strong>Clinical Research / Cancer</strong>
          <span>Best use of existing CV</span>
          <span>InHealth exposure, admin, PAS, data handling, research modules, and project training all fit.</span>
        </div>
        <div class="route-row" role="row">
          <span>3</span><strong>Healthcare Science / Physiology</strong>
          <span>Best compromise route</span>
          <span>Science plus patient contact through ECG, respiratory, sleep, audiology, or diagnostic support.</span>
        </div>
        <div class="route-row" role="row">
          <span>4</span><strong>Biomedical Scientist / Lab</strong>
          <span>Available but questionable</span>
          <span>Possible through IBMS/portfolio route, but not the main lane if Luisa dislikes lab isolation.</span>
        </div>
        <div class="route-row" role="row">
          <span>5</span><strong>Primary Care Bridge</strong>
          <span>Useful with exit plan</span>
          <span>Good only if it builds ECG, phlebotomy, NHS systems, referrals, cancer pathway, or clinic exposure.</span>
        </div>
      </div>
      <label class="field-label" for="route-decision">Current route decision</label>
      <select id="route-decision" data-store="luisaCareerPortal.routeDecision">
        <option value="">Not chosen yet</option>
        <option>Primary: Imaging / Backup: Clinical Research</option>
        <option>Primary: Clinical Research / Backup: Healthcare Science</option>
        <option>Primary: Healthcare Science / Backup: Imaging</option>
        <option>Primary Care Bridge with defined 6-12 month exit plan</option>
      </select>
    </article>

    <article class="mentor-card">
      <h3>Exact Job Titles</h3>
      <details open>
        <summary>Imaging / Radiology</summary>
        <p>Radiology Department Assistant, Imaging Assistant, Clinical Imaging Assistant, Radiography Assistant, Imaging Support Worker, MRI Assistant, CT Assistant, Ultrasound Department Assistant, Mammography Assistant, Radiology HCA, Assistant Practitioner - Imaging, Apprentice Diagnostic Radiographer.</p>
      </details>
      <details>
        <summary>Clinical Research / Cancer</summary>
        <p>Clinical Trials Assistant, Clinical Research Assistant, Research Support Worker, Assistant Clinical Research Practitioner, Clinical Studies Assistant, Clinical Studies Officer, Research Administrator, Cancer Trials Assistant, Oncology Research Assistant, Research Data Assistant, Cancer Pathway Coordinator.</p>
      </details>
      <details>
        <summary>Healthcare Science / Physiology</summary>
        <p>Healthcare Science Assistant, Assistant Technical Officer, Cardiographer, ECG Technician, Cardiac Physiology Assistant, Respiratory Physiology Assistant, Sleep Physiology Assistant, Audiology Assistant, Newborn Hearing Screener, Neurophysiology Assistant, Vascular Science Assistant, Ophthalmic Imaging Assistant.</p>
      </details>
    </article>

    <article class="mentor-card">
      <h3>Wednesday Questions</h3>
      <ul class="question-list">
        <li>Which direction feels most like the future you actually want?</li>
        <li>If radiography took two years of retraining or apprenticeship, would you still want it?</li>
        <li>Would you enjoy clinical trials or cancer research coordination?</li>
        <li>Would you enjoy diagnostic tests such as ECGs, respiratory tests, sleep studies, or audiology?</li>
        <li>Do you want lab work, or are you only considering it because of the degree?</li>
        <li>What is non-negotiable over the next 12 months: income, location, hours, or lifestyle?</li>
      </ul>
    </article>

    <article class="mentor-card wide-card">
      <h3>Meeting Structure</h3>
      <div class="meeting-structure">
        <div><strong>First 10 min</strong><span>Wellbeing and tone: how is Luisa actually doing?</span></div>
        <div><strong>Next 10 min</strong><span>Reflect the CV back: the issue is not ability, it is positioning.</span></div>
        <div><strong>Next 20 min</strong><span>Choose route: imaging, research, healthcare science, lab, or bridge.</span></div>
        <div><strong>Next 20 min</strong><span>Build job search list: primary lane, secondary lane, bridge lane.</span></div>
        <div><strong>Final 15 min</strong><span>Agree actions: identify 6 suitable roles and apply to 3 properly.</span></div>
      </div>
    </article>

    <article class="mentor-card wide-card">
      <h3>NHS Person Specification Evidence Map</h3>
      <div class="evidence-table" role="table" aria-label="NHS person specification evidence map">
        <div class="evidence-row evidence-head"><span>Requirement</span><span>Luisa's evidence</span></div>
        <div class="evidence-row"><span>Communication</span><span>InHealth calls, vulnerable patients, SEN students, families, MDT.</span></div>
        <div class="evidence-row"><span>Confidentiality</span><span>Patient records, Data Protection Act, IGSoC, care notes.</span></div>
        <div class="evidence-row"><span>Patient-centred care</span><span>Florence, Cygnet, InHealth, SEN support.</span></div>
        <div class="evidence-row"><span>Accuracy</span><span>PAS, appointment scheduling, records, incident notes.</span></div>
        <div class="evidence-row"><span>Scientific background</span><span>First Class Biomedical Science, IBMS-accredited degree.</span></div>
        <div class="evidence-row"><span>Research/data</span><span>Research project, translational research skills, project documentation.</span></div>
      </div>
    </article>

    <article class="mentor-card wide-card">
      <h3>CV Repair Plan</h3>
      <div class="repair-grid">
        <div>
          <h4>Main problems</h4>
          <ul>
            <li>Too long for Luisa's current stage.</li>
            <li>Profile is too generic and does not name a target route.</li>
            <li>Skills are duplicated and broad.</li>
            <li>Florence/InHealth overlap should be clarified if both were active.</li>
            <li>Bullets need stronger evidence of judgement, escalation, documentation, clinical teams, and prioritisation.</li>
          </ul>
        </div>
        <div>
          <h4>Keep visible when relevant</h4>
          <ul>
            <li>Clinical Immunology, Cell Pathology, Medical/Public Health Microbiology.</li>
            <li>Clinical and Molecular Genetics, Haematology and Transfusion, Human Physiology.</li>
            <li>Pathophysiology, Research Project, Translational Research Skills.</li>
            <li>PAS, clinical record-keeping, IGSoC, GDPR, appointment scheduling, audit/reporting.</li>
          </ul>
        </div>
      </div>
      <div class="profile-stack">
        <details open>
          <summary>Imaging / Radiology CV profile</summary>
          <p>First Class Biomedical Science graduate from an IBMS-accredited programme, with multi-year patient-facing experience across mental health support, adult care, SEN education, and patient administration within a private cancer service. Experienced in communicating with vulnerable or anxious individuals, maintaining accurate clinical records, coordinating appointments, working with multidisciplinary teams, and upholding confidentiality and safeguarding standards. Now seeking to build a long-term patient-facing NHS career in imaging, diagnostics, or healthcare science.</p>
        </details>
        <details>
          <summary>Clinical Research CV profile</summary>
          <p>First Class Biomedical Science graduate with patient-facing healthcare experience, private cancer-service exposure, strong administrative accuracy, and project-support training. Experienced in appointment coordination, patient communication, clinical data handling, confidentiality, structured questioning, MDT communication, and record-keeping. Seeking to develop a career in clinical research, trials support, or cancer pathway services, combining scientific understanding with patient support and high-quality research administration.</p>
        </details>
        <details>
          <summary>Healthcare Science CV profile</summary>
          <p>First Class Biomedical Science graduate with strong interest in patient-facing diagnostics and healthcare science. Brings experience supporting adults with complex care, mental health and learning disability needs, alongside patient administration, clinical record-keeping, confidentiality, and multidisciplinary communication. Seeking an entry-level healthcare science, physiological sciences, or assistant technical role with structured progression.</p>
        </details>
      </div>
    </article>

    <article class="mentor-card">
      <h3>STAR Evidence Bank</h3>
      <ol class="star-bank">
        <li>De-escalating a distressed patient or service user.</li>
        <li>Handling confidential patient information accurately.</li>
        <li>Managing a high-volume workload.</li>
        <li>Coordinating appointments or patient pathways.</li>
        <li>Working with an MDT.</li>
        <li>Escalating safeguarding or risk concerns.</li>
        <li>Adapting communication to a vulnerable person.</li>
        <li>Using scientific knowledge to understand patient care.</li>
        <li>Supporting process improvement or project documentation.</li>
      </ol>
      <textarea data-store="luisaCareerPortal.starBuilder" rows="6">Build 10 examples here. For each: Situation, Task, Action, Result, NHS value/person-spec link.</textarea>
    </article>

    <article class="mentor-card">
      <h3>Guardrails</h3>
      <ul class="question-list">
        <li>Do not apply for random NHS admin jobs just to get into the NHS.</li>
        <li>Do not send the same CV everywhere.</li>
        <li>Do not apply for Band 5 Biomedical Scientist roles unless trainee or portfolio routes are supported.</li>
        <li>Do not take another low-progression care role unless it builds specific clinical skills or NHS systems exposure.</li>
        <li>Do not overtrain before applying. Applications come first.</li>
      </ul>
    </article>

    <article class="mentor-card wide-card">
      <h3>Application Tracker</h3>
      <div class="application-table" role="group" aria-label="Application tracker">
        <div class="application-row application-head">
          <span>Role</span><span>Organisation</span><span>Status</span><span>Next step</span>
        </div>
        <div class="application-row" data-application-row>
          <input aria-label="Role 1" value="Imaging Assistant" />
          <input aria-label="Organisation 1" value="NHS Trust" />
          <select aria-label="Status 1">
            <option>Researching</option>
            <option selected>Preparing CV</option>
            <option>Applied</option>
            <option>Interview</option>
          </select>
          <input aria-label="Next step 1" value="Tailor CV evidence" />
        </div>
        <div class="application-row" data-application-row>
          <input aria-label="Role 2" value="Clinical Research Assistant" />
          <input aria-label="Organisation 2" value="Cancer services" />
          <select aria-label="Status 2">
            <option selected>Researching</option>
            <option>Preparing CV</option>
            <option>Applied</option>
            <option>Interview</option>
          </select>
          <input aria-label="Next step 2" value="Map person spec evidence" />
        </div>
      </div>
      <p class="save-status" data-save-status role="status" aria-live="polite"></p>
    </article>

    <article class="mentor-card">
      <h3>Weekly Review Tracker</h3>
      <textarea data-store="luisaCareerPortal.weeklyReviews" rows="8">Week 1: Wednesday call. Agree primary lane and backup lane. Rewrite CV into two versions. Set NHS Jobs alerts.
Week 2: Pick six vacancies. Apply to three properly. Contact named contacts where appropriate.
Week 3: Review outcomes. If no interviews, supporting statement is not scoring. Apply to another three to five roles.
Week 4: Prepare interview answers for motivation, confidentiality, safeguarding, prioritising, MDT work, feedback, and EDI.</textarea>
    </article>

    <article class="mentor-card">
      <h3>Planning Notes</h3>
      <textarea data-store="luisaCareerPortal.notes" rows="8">Guiding sentence: Luisa's problem is not a lack of ability. The issue is that her experience is currently pointing in several directions at once. The task is to identify the right one and move toward it deliberately.</textarea>
    </article>
  </div>
</div>
