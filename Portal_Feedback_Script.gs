/**
 * தமிழ்நாடு பள்ளிக் கல்வித்துறை - முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்
 * உயர்கல்வி வழிகாட்டல் தளம் (Career Guidance Portal)
 *
 * நிரல் 1: இணையதள ஆலோசனைக் களம் (Portal_Feedback_Script.gs)
 *
 * மின்னஞ்சல் நெறிமுறை:
 * 1. சம்மந்தப்பட்டவரின் மின்னஞ்சலுக்கு: அனிமேஷனுடன் கூடிய கவர்ச்சிகரமான "மின் வாழ்த்து அட்டை"
 * 2. நிர்வாக மின்னஞ்சலுக்கு (ceosvgweb@gmail.com): புதிய ஆலோசனை குறித்த முழுமையான அறிக்கை
 */

const ADMIN_FEEDBACK_EMAIL = "ceosvgweb@gmail.com";

function doGet(e) {
  return handleFeedback(e);
}

function doPost(e) {
  return handleFeedback(e);
}

function handleFeedback(e) {
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
        const greetingSubject = "🎉 நல்வாழ்த்துகள் & நன்றி மடல்: உயர்கல்வி வழிகாட்டல் தளம், சிவகங்கை மாவட்டம் (Ref: " + refId + ")";
        const greetingHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="margin: 0; padding: 20px; background-color: #0b1120; font-family: 'Segoe UI', Arial, sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); border: 3px solid #d4af37; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.6);">
              
              <tr>
                <td style="padding: 28px 24px 16px; text-align: center; background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.25) 0%, transparent 70%);">
                  <div style="font-size: 36px; line-height: 1; margin-bottom: 8px;">🏛️ ✨ 🎖️</div>
                  <div style="color: #fef08a; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">தமிழ்நாடு பள்ளிக் கல்வித்துறை</div>
                  <h1 style="color: #ffffff; font-size: 20px; font-weight: 900; margin: 4px 0 2px;">முதன்மைக் கல்வி அலுவலகம், சிவகங்கை மாவட்டம்</h1>
                  <div style="color: #38bdf8; font-size: 14px; font-weight: 700; margin-top: 4px;">உயர்கல்வி வழிகாட்டுதல் மையம் • கருத்துக் களம்</div>
                </td>
              </tr>

              <tr>
                <td style="text-align: center; padding: 0 24px 12px;">
                  <div style="display: inline-block; background: linear-gradient(90deg, #b45309, #d97706, #b45309); border: 1.5px solid #fde047; padding: 8px 26px; border-radius: 999px; color: #ffffff; font-weight: 900; font-size: 15px;">
                    🎉 அதிகாரப்பூர்வ மின் வாழ்த்து அட்டை (GREETING CARD) 🎉
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 12px 30px 24px;">
                  <div style="background: rgba(255, 255, 255, 0.06); border: 1.5px solid rgba(212, 175, 55, 0.4); border-radius: 14px; padding: 22px 20px; text-align: center;">
                    <p style="color: #fef08a; font-size: 18px; font-weight: 800; margin: 0 0 10px;">
                      அன்பார்ந்த <b>${name}</b> அவர்களுக்கு,
                    </p>
                    <p style="color: #e2e8f0; font-size: 15px; line-height: 1.7; margin: 0 0 14px;">
                      சிவகங்கை மாவட்ட உயர்கல்வி வழிகாட்டல் இணையதளத்தை (<a href="https://ceosvg.in" style="color: #38bdf8; text-decoration: none; font-weight: bold;">ceosvg.in</a>) மேம்படுத்துவதற்காக தங்களின் மேலான ஆலோசனை மற்றும் கருத்துகளைப் பகிர்ந்து கொண்டமைக்கு எங்களது <b>மனமார்ந்த நன்றியினையும் பாராட்டு கலந்த நல்வாழ்த்துகளையும்</b> தெரிவித்துக் கொள்கிறோம்!
                    </p>
                    
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
          name: "மாவட்ட உயர்கல்வி வழிகாட்டல் மையம்",
          subject: greetingSubject,
          htmlBody: greetingHtml
        });
      } catch (userMailErr) {
        Logger.log("User Greeting Mail Error: " + userMailErr);
      }
    }

    // 3. கூடுதலாக நிர்வாக மின்னஞ்சலுக்கு (ceosvgweb@gmail.com) முழுமையான அறிக்கை அனுப்புதல்
    try {
      const adminSubject = "💡 [புதிய ஆலோசனை பெறப்பட்டது] " + name + " - " + place + " (Ref: " + refId + ")";
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #ea580c; border-radius: 10px; padding: 20px; color: #1e293b;">
          <h2 style="color: #9a3412; margin-top: 0; border-bottom: 2px solid #ffedd5; padding-bottom: 8px;">💡 உயர்கல்வி வழிகாட்டல் தளம் - புதிய ஆலோசனைப் பதிவு</h2>
          <table border="0" cellpadding="8" cellspacing="0" width="100%" style="font-size: 14px; border-collapse: collapse;">
            <tr style="background: #fff7ed;"><td width="35%"><b>குறிப்பு எண் (Ref ID):</b></td><td style="color: #ea580c; font-weight: bold;">${refId}</td></tr>
            <tr><td><b>பதிவு நேரம்:</b></td><td>${timestamp}</td></tr>
            <tr style="background: #fff7ed;"><td><b>பெயர்:</b></td><td>${name}</td></tr>
            <tr><td><b>பள்ளி / ஊர்:</b></td><td>${place}</td></tr>
            <tr style="background: #fff7ed;"><td><b>தொலைபேசி:</b></td><td><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td><b>மின்னஞ்சல்:</b></td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr style="background: #fff7ed;"><td><b>இணைப்பு (Link):</b></td><td>${webLink ? '<a href="' + webLink + '">' + webLink + '</a>' : 'இல்லை'}</td></tr>
            <tr><td colspan="2" style="border-top: 1px solid #fed7aa; padding-top: 12px;"><b>ஆலோசனை / கருத்து விவரம்:</b><br><div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; margin-top: 6px; font-style: italic; line-height: 1.6;">${message}</div></td></tr>
          </table>
          <div style="margin-top: 16px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
            சிவகங்கை மாவட்ட உயர்கல்வி வழிகாட்டல் தளம் • ceosvgweb@gmail.com
          </div>
        </div>
      `;
      MailApp.sendEmail({
        to: ADMIN_FEEDBACK_EMAIL,
        name: "மாவட்ட உயர்கல்வி வழிகாட்டல் மையம்",
        subject: adminSubject,
        htmlBody: adminHtml
      });
    } catch (adminMailErr) {
      Logger.log("Admin Notification Mail Error: " + adminMailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", refId: refId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
