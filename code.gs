const SHEET_ID = "SHEET_ID";
const SHEET_NAME = "BudgetTool";

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  var action = "save";
  var data = {};
  var callbackName = "";

  try {
    if (e && e.parameter) {
      if (e.parameter.callback) {
        callbackName = e.parameter.callback;
      }

      if (e.parameter.action) {
        action = e.parameter.action;
      }

      if (e.parameter.payload) {
        data = JSON.parse(e.parameter.payload);
        if (data.action) action = data.action;
      }
    }

    if (
      e &&
      e.postData &&
      e.postData.contents &&
      e.postData.type &&
      e.postData.type.indexOf("application/json") !== -1
    ) {
      var posted = JSON.parse(e.postData.contents);
      if (posted.action) action = posted.action;
      data = posted;
    }

  } catch (err) {
    return respond(
      { status: "error", message: "Parse error: " + err.toString() },
      callbackName
    );
  }

  if (action === "load") {
    try {
      var raw = sheet.getRange("H2").getValue();
      if (raw && raw.length > 0) {
        var parsed = JSON.parse(raw);
        return respond({
          status: "ok",
          data: parsed,
          sheetName: sheet.getName(),
          lastSyncedCell: sheet.getRange("B1").getDisplayValue()
        }, callbackName);
      } else {
        return respond({
          status: "empty",
          sheetName: sheet.getName()
        }, callbackName);
      }
    } catch (err) {
      return respond({ status: "error", message: err.toString() }, callbackName);
    }
  }

  if (action === "ping") {
    var pingId = new Date().getTime();
    sheet.getRange("C1").setValue("Debug Save ID");
    sheet.getRange("D1").setValue(pingId);

    return respond({
      status: "ok",
      pinged: true,
      sheetName: sheet.getName(),
      d1: sheet.getRange("D1").getDisplayValue()
    }, callbackName);
  }

  try {
    sheet.clearContents();

    sheet.getRange("A1").setValue("Last Synced");
    sheet.getRange("B1").setValue(new Date());
    sheet.getRange("C1").setValue("Debug Save ID");
    sheet.getRange("D1").setValue(new Date().getTime());
    sheet.getRange("H1").setValue("Raw JSON");
    sheet.getRange("H2").setValue(JSON.stringify(data));

    var row = 3;

    // INCOME
    sheet.getRange(row, 1).setValue("INCOME");
    row++;
    sheet.getRange(row, 1, 1, 6).setValues([
      ["Name", "Amount", "Frequency", "Next Date", "Received", "ID"]
    ]);
    row++;

    if (data.incomes && data.incomes.length) {
      for (var i = 0; i < data.incomes.length; i++) {
        var inc = data.incomes[i];
        sheet.getRange(row, 1, 1, 6).setValues([[
          inc.name || "",
          inc.amount || 0,
          inc.frequency || "",
          inc.nextDate || "",
          inc.received || false,
          inc.id || ""
        ]]);
        row++;
      }
    }

    row++;
    sheet.getRange(row, 1).setValue("BILLS");
    row++;
    sheet.getRange(row, 1, 1, 7).setValues([
      ["Name", "Amount", "Due Date", "Category", "Frequency", "Paid", "ID"]
    ]);
    row++;

    if (data.bills && data.bills.length) {
      for (var b = 0; b < data.bills.length; b++) {
        var bill = data.bills[b];
        sheet.getRange(row, 1, 1, 7).setValues([[
          bill.name || "",
          bill.amount || 0,
          bill.dueDate || "",
          bill.category || "",
          bill.frequency || "",
          bill.paid || false,
          bill.id || ""
        ]]);
        row++;
      }
    }

    row++;
    sheet.getRange(row, 1).setValue("ALLOCATIONS");
    row++;
    sheet.getRange(row, 1, 1, 4).setValues([
      ["Income ID", "Bill ID", "Amount", "Alloc ID"]
    ]);
    row++;

    if (data.allocations && data.allocations.length) {
      for (var a = 0; a < data.allocations.length; a++) {
        var alloc = data.allocations[a];
        sheet.getRange(row, 1, 1, 4).setValues([[
          alloc.incomeId || "",
          alloc.billId || "",
          alloc.amount || 0,
          alloc.id || ""
        ]]);
        row++;
      }
    }

    SpreadsheetApp.flush();

    return respond({
      status: "ok",
      synced: new Date().toISOString(),
      lastSyncedCell: sheet.getRange("B1").getDisplayValue(),
      sheetName: sheet.getName(),
      debugSaveId: sheet.getRange("D1").getDisplayValue()
    }, callbackName);

  } catch (err) {
    return respond({
      status: "error",
      message: err.toString()
    }, callbackName);
  }
}

function respond(obj, callbackName) {
  var json = JSON.stringify(obj);

  if (callbackName && callbackName.length > 0) {
    return ContentService
      .createTextOutput(callbackName + "(" + json + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
