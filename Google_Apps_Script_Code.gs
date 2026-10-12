/**
 * தமிழ்நாடு பள்ளிக் கல்வித்துறை - முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்
 * உயர்கல்வி வழிகாட்டல் தளம் (Career Guidance Portal)
 * Google Apps Script Web App for 'Portal_Feedback' & 'Student_Queries'
 *
 * HOW TO DEPLOY:
 * 1. Open Google Sheet 'Portal_Feedback' or 'Student_Queries' in Google Drive.
 * 2. Click Extensions (நீட்டிப்புகள்) -> Apps Script.
 * 3. Replace any existing code with this script and click Save (💾 சேமிக்கவும்).
 * 4. Click Deploy (செயல்படுத்து) -> New deployment (புதிய செயல்முறை).
 * 5. Select type: 'Web app' (இணையப் பயன்பாடு - Gear icon -> Web app).
 * 6. Set Description: 'Career Guidance Webhook'
 * 7. Execute as: 'Me' (உங்கள் கணக்கு)
 * 8. Who has access: 'Anyone' (அனைவருக்கும் அனுமதி - MUST BE 'Anyone')
 * 9. Click Deploy -> Review permissions (அனுமதிகளை உறுதிப்படுத்துங்கள்).
 * 10. Copy the Web App URL (exec URL) and paste it into the form or use directly!
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

    if (formType === "portal_feedback") {
      // Record into Portal_Feedback Sheet
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

      // Send Email with Digital Greeting Card
      if (email && email.indexOf("@") !== -1) {
        try {
          const emailSubject = "நன்றி மடல்: உயர்கல்வி வழிகாட்டல் தளம், சிவகங்கை மாவட்டம் (Ref: " + refId + ")";
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #ffffff; border: 2px solid #d4af37; border-radius: 12px; padding: 24px; text-align: center;">
              <h3 style="color: #fef08a; margin-top: 0;">🏛️ தமிழ்நாடு பள்ளிக் கல்வித்துறை</h3>
              <h2 style="color: #ffffff; margin: 4px 0;">முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்</h2>
              <div style="font-size: 14px; color: #93c5fd; margin-bottom: 16px;">உயர்கல்வி வழிகாட்டுதல் தளம் • கருத்துக் களம்</div>
              <div style="background: rgba(255,255,255,0.08); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <p style="font-size: 16px; color: #fef08a;">அன்பார்ந்த <b>${name}</b> அவர்களுக்கு,</p>
                <p style="font-size: 14px; line-height: 1.6; color: #e2e8f0;">
                  சிவகங்கை மாவட்ட உயர்கல்வி வழிகாட்டல் தளத்தை மேம்படுத்துவதற்காக தங்களின் மேலான ஆலோசனை மற்றும் கருத்துகளைப் பகிர்ந்து கொண்டமைக்கு எங்களது மனமார்ந்த <b>நன்றியினையும் நல்வாழ்த்துகளையும்</b> தெரிவித்துக் கொள்கிறோம்.
                </p>
                <p style="font-size: 13px; color: #bae6fd; font-style: italic;">"எப்பொருள் யார்யார்வாய்க் கேட்பினும் அப்பொருள் மெய்ப்பொருள் காண்ப தறிவு."</p>
                <p style="font-size: 13px; color: #fef08a;">ஆலோசனைக் குறிப்பு எண்: <b>${refId}</b></p>
              </div>
              <div style="font-size: 12px; color: #94a3b8; border-top: 1px dashed rgba(255,255,255,0.3); padding-top: 12px;">
                முதன்மைக் கல்வி அலுவலர் (CEO), முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம் • கட்டணமில்லா உதவி எண்: 14417
              </div>
            </div>
          `;
          MailApp.sendEmail({
            to: email,
            subject: emailSubject,
            htmlBody: emailHtml
          });
        } catch (mailErr) {
          Logger.log("Mail error: " + mailErr);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", refId: refId }))
        .setMimeType(ContentService.MimeType.JSON);

    } else if (formType === "student_query") {
      // Record into Student_Queries Sheet
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

      // Send Acknowledgement Email to Student
      if (email && email.indexOf("@") !== -1) {
        try {
          const emailSubject = "வினா பதிவு செய்யப்பட்டது: உயர்கல்வி வழிகாட்டல் குழு, சிவகங்கை (Ticket: " + ticketId + ")";
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #ffffff; border: 2px solid #38bdf8; border-radius: 12px; padding: 24px; text-align: center;">
              <h3 style="color: #fef08a; margin-top: 0;">🏛️ தமிழ்நாடு பள்ளிக் கல்வித்துறை</h3>
              <h2 style="color: #ffffff; margin: 4px 0;">முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்</h2>
              <div style="font-size: 14px; color: #93c5fd; margin-bottom: 16px;">மாவட்ட உயர்கல்வி வழிகாட்டல் மையம்</div>
              <div style="background: rgba(255,255,255,0.08); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <p style="font-size: 16px; color: #fef08a;">அன்பார்ந்த மாணவர் செல்வம் <b>${name}</b> அவர்களுக்கு,</p>
                <p style="font-size: 14px; line-height: 1.6; color: #e2e8f0;">
                  தங்களின் உயர்கல்வி சேர்க்கை / கட்-ஆஃப் தொடர்பான சந்தேகம் சிவகங்கை மாவட்ட உயர்கல்வி வழிகாட்டல் மையத்தில் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது.
                </p>
                <p style="font-size: 14px; color: #38bdf8; font-weight: bold;">
                  தங்களின் வினா பதிவு செய்யப்பட்டது. எங்களது வழிகாட்டுதல் குழுவினர் தங்களுக்கு மின்னஞ்சல் அல்லது செல்பேசி வாயிலாக தொடர்பு கொள்வர்!
                </p>
                <p style="font-size: 13px; color: #fef08a;">கண்காணிப்பு குறிப்பு எண்: <b>${ticketId}</b></p>
              </div>
              <div style="font-size: 12px; color: #94a3b8; border-top: 1px dashed rgba(255,255,255,0.3); padding-top: 12px;">
                முதன்மைக் கல்வி அலுவலர் (CEO), முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம் • கட்டணமில்லா உதவி எண்: 14417
              </div>
            </div>
          `;
          MailApp.sendEmail({
            to: email,
            subject: emailSubject,
            htmlBody: emailHtml
          });
        } catch (mailErr) {
          Logger.log("Mail error: " + mailErr);
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
