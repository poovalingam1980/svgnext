/**
 * தமிழ்நாடு பள்ளிக் கல்வித்துறை - முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்
 * உயர்கல்வி வழிகாட்டல் தளம் (Career Guidance Portal)
 *
 * நிரல் 2: மாணவர் சந்தேகப் படிவம் (Student_Queries_Script.gs)
 *
 * மின்னஞ்சல் நெறிமுறை:
 * 1. மாணவரின் மின்னஞ்சலுக்கு: "தங்களுடைய சந்தேகங்களுக்கு விரைவில் எங்கள் வழிகாட்டுதல் குழுவினர் உங்களை தொடர்பு கொள்வார்கள்" என்ற
 *    அதிகாரப்பூர்வ ஒப்புகைத் தகவல் (வாழ்த்து அட்டை செல்லாது!).
 * 2. வழிகாட்டல் குழு மின்னஞ்சல்களுக்கு (ceosvgweb@gmail.com, cgsvg2025@gmail.com): புதிய வினா குறித்த உடனடி எச்சரிக்கை மடல்.
 */

const GUIDANCE_TEAM_EMAILS = "ceosvgweb@gmail.com, cgsvg2025@gmail.com";

function doGet(e) {
  return handleStudentQuery(e);
}

function doPost(e) {
  return handleStudentQuery(e);
}

function handleStudentQuery(e) {
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

    // இந்த Google Sheet-ல் நேரடியாகப் பதிதல்
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];

    const timestamp = data.timestamp || new Date().toLocaleString("ta-IN", { timeZone: "Asia/Kolkata" });
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
        const studentSubject = "உயர்கல்வி வழிகாட்டல் வினா பதிவு ஒப்புகை (Ticket ID: " + ticketId + ") - சிவகங்கை மாவட்டம்";
        const studentHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: #ffffff; border: 2px solid #0284c7; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
              
              <tr>
                <td style="padding: 22px 24px; background: linear-gradient(135deg, #0369a1 0%, #0284c7 100%); color: #ffffff; text-align: center;">
                  <div style="font-size: 13px; font-weight: 800; letter-spacing: 1px; color: #fef08a; text-transform: uppercase;">தமிழ்நாடு பள்ளிக் கல்வித்துறை</div>
                  <h2 style="margin: 4px 0 2px; font-size: 18px; font-weight: 900;">முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்</h2>
                  <div style="font-size: 14px; font-weight: 700; color: #e0f2fe;">மாவட்ட உயர்கல்வி வழிகாட்டல் மையம்</div>
                </td>
              </tr>

              <tr>
                <td style="padding: 24px 26px;">
                  <p style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 12px;">
                    அன்பார்ந்த மாணவர் செல்வம் <b>${name}</b> அவர்களுக்கு,
                  </p>
                  <p style="font-size: 14.5px; line-height: 1.65; color: #334155; margin: 0 0 16px;">
                    சிவகங்கை மாவட்ட உயர்கல்வி வழிகாட்டல் மையத்தில் தங்களின் உயர்கல்வி சேர்க்கை / கட்-ஆஃப் தொடர்பான சந்தேகம் வெற்றிகரமாகப் பதிவு செய்யப்பட்டுள்ளது.
                  </p>

                  <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
                    <div style="font-size: 15px; font-weight: 900; color: #15803d; line-height: 1.5;">
                      📞 தங்களுடைய சந்தேகங்களுக்கு விரைவில் எங்கள் வழிகாட்டுதல் குழுவினர் உங்களை தொடர்பு கொள்வார்கள்.
                    </div>
                    <div style="font-size: 13px; color: #166534; margin-top: 4px;">
                      தாங்கள் வழங்கியுள்ள அலைபேசி எண் (<b>${phone}</b>) அல்லது மின்னஞ்சல் வழியாக தங்களுக்குத் தகுந்த உயர்கல்வி வழிகாட்டுதல் வழங்கப்படும்.
                    </div>
                  </div>

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

                  <div style="font-size: 13px; color: #475569; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 14px;">
                    அவசர ஆலோசனை தேவைப்பட்டால் சிவகங்கை மாவட்டத்தின் சிறப்பு வழிகாட்டும் ஆசிரியர்களையோ அல்லது தமிழ்நாடு அரசின் இலவச கட்டணமில்லா உதவி எண் <b>14417</b>-ஐயோ தொடர்பு கொள்ளலாம்.
                  </div>
                </td>
              </tr>

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
          subject: studentSubject,
          htmlBody: studentHtml
        });
      } catch (studentMailErr) {
        Logger.log("Student Ack Mail Error: " + studentMailErr);
      }
    }

    // 3. கூடுதலாக வழிகாட்டல் குழுவினரின் இரண்டு மின்னஞ்சல்களுக்கும் (ceosvgweb@gmail.com, cgsvg2025@gmail.com) முழுமையான அறிக்கை அனுப்புதல்
    try {
      const teamSubject = "🎓 [புதிய மாணவர் சந்தேகம்] " + name + " (" + category + ") - Ticket: " + ticketId;
      const teamHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 2.5px solid #0284c7; border-radius: 12px; padding: 22px; color: #1e293b;">
          <h2 style="color: #0369a1; margin-top: 0; border-bottom: 2px solid #e0f2fe; padding-bottom: 8px;">🎓 உயர்கல்வி வழிகாட்டல் மையம் - புதிய மாணவர் வினா பதிவு</h2>
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; color: #166534; font-size: 13.5px; font-weight: bold;">
            இம்மாணவரை வழிகாட்டல் குழுவினர் தொலைபேசி அல்லது மின்னஞ்சல் வழியே தொடர்பு கொள்ளவும்.
          </div>
          <table border="0" cellpadding="8" cellspacing="0" width="100%" style="font-size: 14px; border-collapse: collapse;">
            <tr style="background: #f8fafc;"><td width="35%"><b>கண்காணிப்பு எண் (Ticket ID):</b></td><td style="color: #0284c7; font-weight: 900; font-size: 15px;">${ticketId}</td></tr>
            <tr><td><b>பதிவு நேரம்:</b></td><td>${timestamp}</td></tr>
            <tr style="background: #f8fafc;"><td><b>மாணவர் பெயர்:</b></td><td><b>${name}</b></td></tr>
            <tr><td><b>வகுப்பு நிலை:</b></td><td>${studentClass}</td></tr>
            <tr style="background: #f8fafc;"><td><b>பள்ளி வகை:</b></td><td>${schoolType}</td></tr>
            <tr><td><b>மாவட்டம்:</b></td><td>${district}</td></tr>
            <tr style="background: #fef08a;"><td style="color: #854d0e;"><b>அலைபேசி எண் (Call):</b></td><td><a href="tel:${phone}" style="font-size: 16px; font-weight: 900; color: #1e3a8a;">${phone}</a></td></tr>
            <tr><td><b>மின்னஞ்சல் (Email):</b></td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr style="background: #f8fafc;"><td><b>சந்தேகப் பிரிவு:</b></td><td><b>${category}</b></td></tr>
            <tr><td colspan="2" style="border-top: 1.5px solid #cbd5e1; padding-top: 14px;"><b>மாணவரின் சந்தேகம் / வினா:</b><br><div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 12px 14px; border-radius: 6px; margin-top: 6px; font-size: 14.5px; line-height: 1.6; color: #0f172a;">${query}</div></td></tr>
          </table>
          <div style="margin-top: 18px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
            சிவகங்கை மாவட்ட உயர்கல்வி வழிகாட்டல் மையம் • வழிகாட்டல் குழு: ceosvgweb@gmail.com, cgsvg2025@gmail.com
          </div>
        </div>
      `;
      MailApp.sendEmail({
        to: GUIDANCE_TEAM_EMAILS,
        subject: teamSubject,
        htmlBody: teamHtml
      });
    } catch (teamMailErr) {
      Logger.log("Guidance Team Mail Error: " + teamMailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", ticketId: ticketId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
