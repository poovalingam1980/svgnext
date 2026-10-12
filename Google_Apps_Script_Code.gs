/**
 * தமிழ்நாடு பள்ளிக் கல்வித்துறை - முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்
 * உயர்கல்வி வழிகாட்டல் தளம் (Career Guidance Portal)
 * Google Apps Script Web App for 'Portal_Feedback' & 'Student_Queries'
 *
 * HOW IT WORKS (எவ்வாறு இயங்குகிறது):
 * 1. கருத்து / ஆலோசனைப் பெட்டி (Portal Feedback):
 *    - விவரங்கள் 'Portal_Feedback' Google Sheet-ல் பதிவாகும்.
 *    - சம்மந்தப்பட்டவரின் மின்னஞ்சலுக்கு அனிமேஷனுடன் கூடிய கவர்ச்சிகரமான "மின் வாழ்த்து அட்டை" (Animated Digital Greeting Card) அனுப்பப்படும்.
 *
 * 2. மாணவர் சந்தேகப் படிவம் (Student Query):
 *    - விவரங்கள் 'Student_Queries' Google Sheet-ல் பதிவாகும்.
 *    - மாணவரின் மின்னஞ்சலுக்கு "தங்களுடைய சந்தேகங்களுக்கு விரைவில் எங்கள் வழிகாட்டுதல் குழுவினர் உங்களை தொடர்பு கொள்வார்கள்" என்ற
 *      அதிகாரப்பூர்வ ஒப்புகைத் தகவல் (Official Acknowledgement Notification) மட்டுமே செல்லும் (வாழ்த்து அட்டை செல்லாது!).
 *
 * HOW TO DEPLOY (செயல்படுத்தும் முறை):
 * 1. கூகுள் டிரைவில் உள்ள 'Portal_Feedback' (அல்லது 'Student_Queries') Google Sheet-ஐத் திறக்கவும்.
 * 2. Extensions (நீட்டிப்புகள்) -> Apps Script என்பதைத் திறக்கவும்.
 * 3. அங்குள்ள பழைய வரிகளை நீக்கிவிட்டு, இந்த முழு நிரலையும் அப்படியே ஒட்டி Save (💾 சேமிக்கவும்) செய்யவும்.
 * 4. Deploy (செயல்படுத்து) -> New deployment (புதிய செயல்முறை) -> Type: Web app தேர்வு செய்யவும்.
 * 5. Execute as: 'Me' (உங்கள் கணக்கு)
 * 6. Who has access: 'Anyone' (அனைவருக்கும் அனுமதி - MUST BE 'Anyone')
 * 7. Deploy கிளிக் செய்து அனுமதிகளை வழங்கவும் (Authorize Access).
 * 8. கிடைக்கும் Web App URL (exec URL)-ஐப் பயன்படுத்தி உடனுக்குடன் மின்னஞ்சல் மற்றும் ஷீட் பதிவுகள் இயங்கும்!
 */

// Spreadsheet IDs in ceosvg.in / Google Sheet folder
const SPREADSHEET_FEEDBACK_ID = "1fSIyCI4AsqA2-8aqRr5XQb7KODEA6pvnyNhjKO_PBSc";
const SPREADSHEET_QUERIES_ID  = "1-nkKQyAqE2IK31Rf4-qXBDVjLD88S2U3d_uF0AGrOZQ";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const formType = data.formType || "portal_feedback";
    const timestamp = data.timestamp || new Date().toLocaleString("ta-IN", { timeZone: "Asia/Kolkata" });

    // =========================================================================
    // 1. ஆலோசனைக் களம் (FEEDBACK) -> SHEET + அனிமேஷன் மின் வாழ்த்து அட்டை
    // =========================================================================
    if (formType === "portal_feedback") {
      const ssId = data.spreadsheetId || SPREADSHEET_FEEDBACK_ID;
      const ss = SpreadsheetApp.openById(ssId);
      const sheet = ss.getSheetByName(data.sheetName || "Sheet1") || ss.getSheets()[0];

      const refId = data.refId || ("TN-FB-2026-" + Math.floor(1000 + Math.random() * 9000));
      const name = data.name || "";
      const place = data.place || "";
      const phone = data.phone || "";
      const email = data.email || "";
      const fileLink = data.fileLink || data.link || "இல்லை";
      const webLink = data.link || "";
      const message = data.message || "";
      const status = "புதியது (New)";

      // 1. Google Sheet-ல் வரிசை சேர்த்தல்
      sheet.appendRow([
        refId,
        timestamp,
        name,
        place,
        phone,
        email,
        fileLink,
        webLink,
        message,
        status
      ]);

      // 2. சம்மந்தப்பட்டவருக்கு அனிமேஷனுடன் கூடிய மின் வாழ்த்து அட்டை மின்னஞ்சல் அனுப்புதல்
      if (email && email.indexOf("@") !== -1) {
        try {
          const emailSubject = "🎉 நல்வாழ்த்துகள் & நன்றி மடல்: உயர்கல்வி வழிகாட்டல் தளம், சிவகங்கை மாவட்டம் (Ref: " + refId + ")";
          const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                @keyframes pulseGlow {
                  0% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.4); }
                  50% { box-shadow: 0 0 25px rgba(250, 204, 21, 0.8), 0 0 40px rgba(212, 175, 55, 0.5); }
                  100% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.4); }
                }
              </style>
            </head>
            <body style="margin: 0; padding: 20px; background-color: #0b1120; font-family: 'Segoe UI', Arial, sans-serif;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); border: 3px solid #d4af37; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.6);">
                
                <!-- Card Header -->
                <tr>
                  <td style="padding: 28px 24px 16px; text-align: center; background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.25) 0%, transparent 70%);">
                    <div style="font-size: 36px; line-height: 1; margin-bottom: 8px;">🏛️ ✨ 🎖️</div>
                    <div style="color: #fef08a; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">தமிழ்நாடு பள்ளிக் கல்வித்துறை</div>
                    <h1 style="color: #ffffff; font-size: 20px; font-weight: 900; margin: 4px 0 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்</h1>
                    <div style="color: #38bdf8; font-size: 14px; font-weight: 700; margin-top: 4px;">உயர்கல்வி வழிகாட்டுதல் மையம் • கருத்துக் களம்</div>
                  </td>
                </tr>

                <!-- Greeting Banner Badge -->
                <tr>
                  <td style="text-align: center; padding: 0 24px 12px;">
                    <div style="display: inline-block; background: linear-gradient(90deg, #b45309, #d97706, #b45309); border: 1.5px solid #fde047; padding: 8px 26px; border-radius: 999px; color: #ffffff; font-weight: 900; font-size: 15px; letter-spacing: 0.5px;">
                      🎉 அதிகாரப்பூர்வ மின் வாழ்த்து அட்டை (GREETING CARD) 🎉
                    </div>
                  </td>
                </tr>

                <!-- Main Greeting Content -->
                <tr>
                  <td style="padding: 12px 30px 24px;">
                    <div style="background: rgba(255, 255, 255, 0.06); border: 1.5px solid rgba(212, 175, 55, 0.4); border-radius: 14px; padding: 22px 20px; text-align: center;">
                      <p style="color: #fef08a; font-size: 18px; font-weight: 800; margin: 0 0 10px;">
                        அன்பார்ந்த <b>${name}</b> அவர்களுக்கு,
                      </p>
                      <p style="color: #e2e8f0; font-size: 15px; line-height: 1.7; margin: 0 0 14px;">
                        சிவகங்கை மாவட்ட உயர்கல்வி வழிகாட்டல் இணையதளத்தை (<a href="https://ceosvg.in" style="color: #38bdf8; text-decoration: none; font-weight: bold;">ceosvg.in</a>) மேம்படுத்துவதற்காக தங்களின் மேலான ஆலோசனை மற்றும் கருத்துகளைப் பகிர்ந்து கொண்டமைக்கு எங்களது <b>மனமார்ந்த நன்றியினையும் பாராட்டு கலந்த நல்வாழ்த்துகளையும்</b> தெரிவித்துக் கொள்கிறோம்!
                      </p>
                      
                      <!-- Thirukkural Citation -->
                      <div style="background: rgba(0, 0, 0, 0.35); border-left: 3px solid #d4af37; padding: 12px 14px; border-radius: 6px; margin: 16px 0; text-align: left;">
                        <div style="color: #fef08a; font-size: 13px; font-weight: 800; line-height: 1.5; font-style: italic;">
                          “எப்பொருள் யார்யார்வாய்க் கேட்பினும் அப்பொருள்<br>மெய்ப்பொருள் காண்ப தறிவு.”
                        </div>
                      </div>

                      <div style="display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px dashed #38bdf8; padding: 6px 18px; border-radius: 8px; color: #bae6fd; font-size: 13px; font-weight: 700;">
                        தங்களின் ஆலோசனைக் குறிப்பு எண்: <b style="color: #ffffff;">${refId}</b>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Footer & CEO Office Info -->
                <tr>
                  <td style="padding: 16px 24px 24px; text-align: center; border-top: 1px dashed rgba(212, 175, 55, 0.3); background: rgba(0,0,0,0.25);">
                    <div style="color: #cbd5e1; font-size: 13px; font-weight: 800;">முதன்மைக் கல்வி அலுவலர் (CEO)</div>
                    <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம் - 630562</div>
                    <div style="color: #38bdf8; font-size: 11px; margin-top: 6px;">📞 அரசு கட்டணமில்லா உதவி எண்: 14417 | 🌐 ceosvg.in</div>
                  </td>
                </tr>

              </table>
            </body>
            </html>
          `;

          MailApp.sendEmail({
            to: email,
            subject: emailSubject,
            htmlBody: emailHtml
          });
        } catch (mailErr) {
          Logger.log("Mail error (Feedback): " + mailErr);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", refId: refId }))
        .setMimeType(ContentService.MimeType.JSON);

    // =========================================================================
    // 2. மாணவர் சந்தேகப் படிவம் (STUDENT QUERY) -> SHEET + வழிகாட்டல் தொடர்பு தகவல் மட்டுமே
    //    (வாழ்த்து அட்டை செல்லாது! ஒப்புகைத் தகவல் மட்டுமே செல்லும்)
    // =========================================================================
    } else if (formType === "student_query") {
      const ssId = data.spreadsheetId || SPREADSHEET_QUERIES_ID;
      const ss = SpreadsheetApp.openById(ssId);
      const sheet = ss.getSheetByName(data.sheetName || "Sheet1") || ss.getSheets()[0];

      const ticketId = data.ticketId || ("TN-CG-2026-" + Math.floor(1000 + Math.random() * 9000));
      const name = data.name || "";
      const studentClass = data.studentClass || "";
      const schoolType = data.schoolType || "";
      const district = data.district || "சிவகங்கை";
      const phone = data.phone || "";
      const email = data.email || "";
      const category = data.category || "";
      const query = data.query || "";
      const remarks = "";
      const status = "புதிய வினா (Pending)";

      // 1. Google Sheet-ல் வரிசை சேர்த்தல்
      sheet.appendRow([
        ticketId,
        timestamp,
        name,
        studentClass,
        schoolType,
        district,
        phone,
        email,
        category,
        query,
        remarks,
        status
      ]);

      // 2. மாணவருக்கு அதிகாரப்பூர்வ வழிகாட்டல் குழு தொடர்பு ஒப்புகைத் தகவல் அனுப்புதல் (வாழ்த்து அட்டை அல்ல!)
      if (email && email.indexOf("@") !== -1) {
        try {
          const emailSubject = "உயர்கல்வி வழிகாட்டல் வினா பதிவு ஒப்புகை (Ticket ID: " + ticketId + ") - சிவகங்கை மாவட்டம்";
          const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #ffffff; border: 2px solid #0284c7; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
                
                <!-- Official Header -->
                <tr>
                  <td style="padding: 22px 24px; background: linear-gradient(135deg, #0369a1 0%, #0284c7 100%); color: #ffffff; text-align: center;">
                    <div style="font-size: 13px; font-weight: 800; letter-spacing: 1px; color: #fef08a; text-transform: uppercase;">தமிழ்நாடு பள்ளிக் கல்வித்துறை</div>
                    <h2 style="margin: 4px 0 2px; font-size: 18px; font-weight: 900;">முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்</h2>
                    <div style="font-size: 14px; font-weight: 700; color: #e0f2fe;">மாவட்ட உயர்கல்வி வழிகாட்டல் மையம்</div>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 24px 26px;">
                    <p style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">
                      அன்பார்ந்த மாணவர் செல்வம் <b>${name}</b> அவர்களுக்கு,
                    </p>
                    <p style="font-size: 14.5px; line-height: 1.65; color: #334155; margin: 0 0 16px;">
                      சிவகங்கை மாவட்ட உயர்கல்வி வழிகாட்டல் மையத்தில் தங்களின் உயர்கல்வி சேர்க்கை / கட்-ஆஃப் தொடர்பான சந்தேகம் வெற்றிகரமாகப் பதிவு செய்யப்பட்டுள்ளது.
                    </p>

                    <!-- Prime Assurance Message (முக்கிய உறுதிப்படுத்தல் வாசகம்) -->
                    <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
                      <div style="font-size: 15px; font-weight: 900; color: #15803d; line-height: 1.5;">
                        📞 தங்களுடைய சந்தேகங்களுக்கு விரைவில் எங்கள் வழிகாட்டுதல் குழுவினர் உங்களை தொடர்பு கொள்வார்கள்.
                      </div>
                      <div style="font-size: 13px; color: #166534; margin-top: 4px;">
                        தாங்கள் வழங்கியுள்ள அலைபேசி எண் (<b>${phone}</b>) அல்லது மின்னஞ்சல் வழியாக தங்களுக்குத் தகுந்த உயர்கல்வி வழிகாட்டுதல் வழங்கப்படும்.
                      </div>
                    </div>

                    <!-- Submitted Details Summary -->
                    <table border="0" cellpadding="6" cellspacing="0" width="100%" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; margin-bottom: 20px;">
                      <tr>
                        <td width="35%" style="color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0;">கண்காணிப்பு எண்:</td>
                        <td style="color: #0284c7; font-weight: 900; border-bottom: 1px solid #e2e8f0;">${ticketId}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0;">வகுப்பு நிலை:</td>
                        <td style="color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${studentClass}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0;">பள்ளி வகை:</td>
                        <td style="color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${schoolType}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0;">சந்தேகப் பிரிவு:</td>
                        <td style="color: #1e293b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${category}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 700; vertical-align: top;">தங்களின் வினா:</td>
                        <td style="color: #0f172a; font-style: italic;">"${query}"</td>
                      </tr>
                    </table>

                    <!-- Helpline Notice -->
                    <div style="font-size: 13px; color: #475569; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 14px;">
                      அவசர ஆலோசனை தேவைப்பட்டால் சிவகங்கை மாவட்டத்தின் சிறப்பு வழிகாட்டும் ஆசிரியர்களையோ அல்லது தமிழ்நாடு அரசின் இலவச கட்டணமில்லா உதவி எண் <b>14417</b>-ஐயோ தொடர்பு கொள்ளலாம்.
                    </div>
                  </td>
                </tr>

                <!-- Official Footer -->
                <tr>
                  <td style="padding: 14px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                    முதன்மைக் கல்வி அலுவலர் (CEO), முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம் • <a href="https://ceosvg.in" style="color: #0284c7; text-decoration: none;">ceosvg.in</a>
                  </td>
                </tr>

              </table>
            </body>
            </html>
          `;

          MailApp.sendEmail({
            to: email,
            subject: emailSubject,
            htmlBody: emailHtml
          });
        } catch (mailErr) {
          Logger.log("Mail error (Student Query): " + mailErr);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", ticketId: ticketId }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "invalid_type" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
