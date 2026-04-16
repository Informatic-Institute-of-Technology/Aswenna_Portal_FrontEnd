import { jsPDF } from "jspdf";

export interface AgreementMilestone {
  no: number;
  task: string;
  targetDate: string;
  grossAmount: number;
}

export interface AgreementDetails {
  agreementType: "Investor-Farmer" | "Investor-Landowner";
  aswennaLogoDataUrl?: string;
  governmentLogoDataUrl?: string;

  investorName: string;
  investorNIC?: string;
  investorContact?: string;

  counterpartyName: string;
  counterpartyNIC?: string;
  counterpartyContact?: string;

  projectRefId?: string;
  targetCrop?: string;

  propertyLocation?: string;
  acreage?: string;
  designatedCultivator?: string;
  leaseDurationMonths?: number;
  leaseStartDate?: string;
  leaseEndDate?: string;
  grossMonthlyRental?: number;

  estimatedStartDate?: string;
  estimatedEndDate?: string;
  totalGrossInvestment?: number;
  milestones?: AgreementMilestone[];

  investorIP?: string;
  counterpartyIP?: string;
  investorTimestamp?: string;
  counterpartyTimestamp?: string;
}

const PAYHERE_FEE = 0.0299;
const PLATFORM_FEE = 0.005;
const TOTAL_FEE = PAYHERE_FEE + PLATFORM_FEE;

const NA = "N/A";

const fmt = (n: number) =>
  `LKR ${n.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

const longDate = () =>
  new Date().toLocaleDateString("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const nowTS = () => new Date().toLocaleString("en-LK");

function buildDoc(det: AgreementDetails): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const ML = 20;
  const MR = W - 20;
  const TW = MR - ML;
  const HDR = 12;
  const FTR = H - 16;
  let y = HDR + 6;

  const C = {
    black: [0, 0, 0] as const,
    ink: [15, 15, 15] as const,
    charcoal: [40, 40, 40] as const,
    steel: [80, 80, 80] as const,
    silver: [140, 140, 140] as const,
    rule: [190, 190, 190] as const,
    shade: [245, 245, 245] as const,
    white: [255, 255, 255] as const,
  };

  const isLnd = det.agreementType === "Investor-Landowner";

  const tw = (
    txt: string,
    x: number,
    sy: number,
    mw: number,
    lh: number,
  ): number => {
    const lines = doc.splitTextToSize(txt, mw);
    doc.text(lines, x, sy);
    return sy + lines.length * lh;
  };

  const need = (h: number) => {
    if (y + h > FTR) addPage();
  };

  const drawHeader = () => {};

  const drawCoverHeader = () => {};

  const drawFooter = () => {
    const pg = doc.getCurrentPageInfo().pageNumber;
    const ref = det.projectRefId ?? "ASW-DRAFT";
    doc
      .setDrawColor(...C.rule)
      .setLineWidth(0.25)
      .line(ML, H - 14, MR, H - 14);
    doc
      .setFont("helvetica", "normal")
      .setFontSize(6.5)
      .setTextColor(...C.silver);
    doc.text(
      `Ref: ${ref}   |   ${longDate()}   |   Page ${pg}   |   Governed by the Laws of Sri Lanka`,
      W / 2,
      H - 9.5,
      { align: "center" },
    );
  };

  const addPage = () => {
    doc.addPage();
    y = HDR + 6;
    drawHeader();
    drawFooter();
  };

  const partBanner = (txt: string) => {
    need(14);
    y += 3;
    doc.setFillColor(...C.black);
    doc.rect(ML, y, TW, 9, "F");
    doc
      .setFont("helvetica", "bold")
      .setFontSize(9.5)
      .setTextColor(...C.white);
    doc.text(txt, ML + 4, y + 6.2);
    y += 12;
  };

  const sectionHead = (txt: string) => {
    need(11);
    y += 4;
    doc.setFillColor(...C.shade);
    doc.setDrawColor(...C.rule).setLineWidth(0.3);
    doc.rect(ML, y, TW, 8, "FD");

    doc.setFillColor(...C.black);
    doc.rect(ML, y, 2.5, 8, "F");
    doc
      .setFont("helvetica", "bold")
      .setFontSize(8.5)
      .setTextColor(...C.charcoal);
    doc.text(txt, ML + 6, y + 5.3);
    y += 11;
  };

  const subHead = (num: string, title: string) => {
    need(10);
    y += 3;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(9)
      .setTextColor(...C.ink);
    doc.text(`${num}  ${title}`, ML, y);
    y += 5;
  };

  const body = (txt: string, indent = 0) => {
    need(10);
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .setTextColor(...C.ink);
    y = tw(txt, ML + indent, y, TW - indent, 5.0);
    y += 2.5;
  };

  const bul = (txt: string) => {
    need(10);
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .setTextColor(...C.ink);
    doc.text("•", ML + 6, y);
    y = tw(txt, ML + 12, y, TW - 12, 5.0);
    y += 2;
  };

  const rule = (w = 0.25, col = C.rule) => {
    doc
      .setDrawColor(...col)
      .setLineWidth(w)
      .line(ML, y, MR, y);
  };

  const gap = (n = 4) => {
    y += n;
  };

  const gridRow = (label: string, value: string) => {
    need(8);
    doc
      .setFont("helvetica", "bold")
      .setFontSize(8.5)
      .setTextColor(...C.steel);
    doc.text(`${label}:`, ML + 3, y);
    doc.setFont("helvetica", "normal").setTextColor(...C.ink);
    y = tw(value || NA, ML + 58, y, TW - 60, 4.8);
    y += 1.5;
  };

  const drawTable = (
    headers: string[],
    cols: number[],
    rows: string[][],
    totals?: string[],
  ) => {
    const RH = 8;
    const HDH = 8;
    need(HDH + 10);

    doc.setFillColor(...C.black);
    doc.rect(ML, y, TW, HDH, "F");
    doc
      .setFont("helvetica", "bold")
      .setFontSize(7.5)
      .setTextColor(...C.white);
    let cx = ML;
    headers.forEach((h, i) => {
      doc.text(h, cx + 2.5, y + 5.2);
      cx += cols[i];
    });
    y += HDH;

    rows.forEach((row, ri) => {
      need(RH);
      doc.setFillColor(
        ri % 2 === 0 ? 250 : 255,
        ri % 2 === 0 ? 250 : 255,
        ri % 2 === 0 ? 250 : 255,
      );
      doc.rect(ML, y, TW, RH, "F");
      doc
        .setDrawColor(...C.rule)
        .setLineWidth(0.18)
        .line(ML, y + RH, MR, y + RH);
      doc
        .setFont("helvetica", "normal")
        .setFontSize(7.8)
        .setTextColor(...C.ink);
      cx = ML;
      row.forEach((v, i) => {
        doc.text(v, cx + 2.5, y + 5.3);
        cx += cols[i];
      });
      y += RH;
    });

    if (totals) {
      need(RH);
      doc.setFillColor(...C.shade);
      doc.rect(ML, y, TW, RH, "F");
      doc
        .setFont("helvetica", "bold")
        .setFontSize(7.8)
        .setTextColor(...C.charcoal);
      cx = ML;
      totals.forEach((v, i) => {
        doc.text(v, cx + 2.5, y + 5.3);
        cx += cols[i];
      });
      y += RH;
    }

    const totalH = HDH + RH * rows.length + (totals ? RH : 0);
    doc
      .setDrawColor(...C.rule)
      .setLineWidth(0.35)
      .rect(ML, y - totalH, TW, totalH, "S");
    y += 5;
  };

  drawCoverHeader();
  drawFooter();
  y = HDR + 6;

  doc.setDrawColor(...C.black).setLineWidth(0.8);
  doc.rect(ML - 3, y, TW + 6, H - HDR - 24, "S");

  doc.setDrawColor(...C.rule).setLineWidth(0.25);
  doc.rect(ML - 1, y + 2, TW + 2, H - HDR - 28, "S");
  y += 10;

  {
    const logoY = y;

    let aW = 38;
    let aH = 14;
    let gW = 11.5;
    let gH = 16;

    if (det.aswennaLogoDataUrl) {
      try {
        const props = doc.getImageProperties(det.aswennaLogoDataUrl);
        aH = 16;
        aW = aH * (props.width / props.height);
      } catch (err) {
        console.error(err);
      }
    }

    if (det.governmentLogoDataUrl) {
      try {
        const gProps = doc.getImageProperties(det.governmentLogoDataUrl);
        gH = 18;
        gW = gH * (gProps.width / gProps.height);
      } catch (err) {
        console.error(err);
      }
    }

    const gap = 16;
    const totalW = aW + gap + gW;
    const startX = (W - totalW) / 2;

    if (det.aswennaLogoDataUrl) {
      try {
        const maxH = Math.max(aH, gH);
        const aY = logoY + (maxH - aH) / 2;
        doc.addImage(
          det.aswennaLogoDataUrl,
          "PNG",
          startX,
          aY,
          aW,
          aH,
          "",
          "FAST",
        );
      } catch {
        doc
          .setFont("helvetica", "bold")
          .setFontSize(9)
          .setTextColor(...C.charcoal);
        doc.text("ASWENNA", startX + 4, logoY + 10);
      }
    }

    const sepX = startX + aW + gap / 2;
    doc
      .setDrawColor(...C.rule)
      .setLineWidth(0.3)
      .line(sepX, logoY + 1, sepX, logoY + Math.max(aH, gH) - 1);

    if (det.governmentLogoDataUrl) {
      try {
        const maxH = Math.max(aH, gH);
        const gY = logoY + (maxH - gH) / 2;

        doc.addImage(
          det.governmentLogoDataUrl,
          "PNG",
          startX + aW + gap,
          gY,
          gW,
          gH,
          "",
          "FAST",
        );
      } catch {
        doc
          .setFont("helvetica", "normal")
          .setFontSize(6.5)
          .setTextColor(...C.steel);
        doc.text("GOV.", startX + aW + gap + 2, logoY + 8);
        doc.text("SRI LANKA", startX + aW + gap, logoY + 13);
      }
    }

    y += Math.max(aH, gH) + 10;
  }

  doc
    .setDrawColor(...C.rule)
    .setLineWidth(0.25)
    .line(ML + 20, y, MR - 20, y);
  y += 12;

  const mainTitle = isLnd
    ? "ELECTRONIC LAND LEASE &\nFINANCIAL AGREEMENT"
    : "ELECTRONIC CULTIVATION &\nESCROW AGREEMENT";
  const subTitle = isLnd
    ? "Investor & Landowner"
    : "Investor & Farmer Joint Venture";

  doc
    .setFont("helvetica", "bold")
    .setFontSize(18)
    .setTextColor(...C.black);
  const titleLines = doc.splitTextToSize(mainTitle, TW - 20);
  doc.text(titleLines, W / 2, y, { align: "center" });
  y += titleLines.length * 10 + 4;

  doc
    .setFont("helvetica", "normal")
    .setFontSize(10)
    .setTextColor(...C.steel);
  doc.text(`( ${subTitle} )`, W / 2, y, { align: "center" });
  y += 8;

  doc
    .setDrawColor(...C.black)
    .setLineWidth(1.2)
    .line(ML + 6, y, MR - 6, y);
  y += 2;
  doc
    .setDrawColor(...C.rule)
    .setLineWidth(0.3)
    .line(ML + 6, y, MR - 6, y);
  y += 12;

  doc
    .setFont("helvetica", "italic")
    .setFontSize(8)
    .setTextColor(...C.silver);
  doc.text(
    "Issued by the Aswenna Agricultural Investment Platform — Sri Lanka",
    W / 2,
    y,
    { align: "center" },
  );
  y += 14;

  {
    const bh = 20;

    doc.setFillColor(...C.shade);
    doc.setDrawColor(...C.rule).setLineWidth(0.3);
    doc.rect(ML + 4, y, TW - 8, bh, "FD");
    doc.setFillColor(...C.black).rect(ML + 4, y, 3.5, bh, "F");

    doc
      .setFont("helvetica", "bold")
      .setFontSize(8)
      .setTextColor(...C.charcoal);
    doc.text("LEGAL NOTICE", ML + 12, y + 6.5);

    doc
      .setFont("helvetica", "normal")
      .setFontSize(7.8)
      .setTextColor(...C.charcoal);
    doc.text(
      "This document constitutes a legally binding electronic contract under the laws of the " +
        "Democratic Socialist Republic of Sri Lanka, executed pursuant to the Electronic Transactions " +
        "Act, No. 19 of 2006 (Sections 3, 4, 8 & 11).",
      ML + 12,
      y + 12,
      { maxWidth: TW - 20 },
    );
    y += bh + 8;
  }

  {
    const refId =
      det.projectRefId ??
      (isLnd
        ? "#ASW-INV-LND-[Auto-generated]"
        : "#ASW-INV-FAR-[Auto-generated]");

    const lx = ML + 4;
    const vx = ML + 4 + 46;
    const rx = W / 2 + 8;
    const rvx = W / 2 + 8 + 36;
    const rowH = 7;
    const bh = 26;

    doc.setFillColor(252, 252, 252);
    doc.setDrawColor(...C.rule).setLineWidth(0.3);
    doc.rect(ML + 4, y, TW - 8, bh, "FD");

    doc
      .setDrawColor(...C.rule)
      .setLineWidth(0.2)
      .line(W / 2 + 2, y + 3, W / 2 + 2, y + bh - 3);

    doc
      .setFont("helvetica", "bold")
      .setFontSize(7.8)
      .setTextColor(...C.steel);
    doc.text("Reference ID:", lx, y + rowH);
    doc.text("Date of Execution:", lx, y + rowH * 2 + 2);
    doc.text("Agreement Type:", rx, y + rowH);
    doc.text("Agreement No.:", rx, y + rowH * 2 + 2);

    doc.setFont("helvetica", "normal").setTextColor(...C.ink);
    doc.text(refId, vx, y + rowH);
    doc.text(longDate(), vx, y + rowH * 2 + 2);
    doc.text(det.agreementType, rvx, y + rowH);
    doc.text(
      "ASW / " + new Date().getFullYear() + " / E",
      rvx,
      y + rowH * 2 + 2,
    );

    y += bh + 8;
  }

  addPage();
  partBanner("PART I: GENERAL TERMS AND LEGAL CONDITIONS");

  sectionHead("CLAUSE 1: LEGAL FRAMEWORK & ELECTRONIC ASSENT");

  subHead("1.1", "Validity");
  body(
    "Pursuant to Sections 3, 4, 8, and 11 of the Electronic Transactions Act, No. 19 of 2006 (as amended), the Parties explicitly agree that the formation of this contract via the Aswenna Platform is legally valid, binding, and enforceable.",
  );

  subHead("1.2", "Non-Repudiation");
  body(
    'Neither Party shall deny the legal effect of this Agreement solely on the grounds that it exists in an electronic format or was executed via a "Click-to-Accept" digital signature.',
  );

  subHead("1.3", "Evidentiary Records");
  body(
    isLnd
      ? "All digital logs, timestamps, payment authorizations, and chat histories stored on the Aswenna Platform shall be admissible as evidence in the event of a dispute."
      : "All digital logs, timestamps, chat histories, and photographic evidence uploaded to the Platform shall be admissible as evidence in the event of a dispute.",
  );

  sectionHead(
    isLnd
      ? "CLAUSE 2: SCOPE OF THE LEASE & EXCLUSIVITY"
      : "CLAUSE 2: SCOPE OF THE JOINT VENTURE & EXCLUSIVITY",
  );

  subHead("2.1", "Purpose");
  body(
    isLnd
      ? 'The Landowner agrees to provide exclusive access to the specified agricultural land for the use of a "Designated Cultivator" (the Farmer matched on the Platform), and the Investor agrees to finance this lease via automated monthly payments.'
      : "The Investor and the Farmer agree to enter into a joint venture specifically for the cultivation of the crop detailed in Part II, on the designated land parcel, for the specified Project Duration.",
  );

  subHead("2.2", 'The "Locked Deal" Principle');
  body("Upon execution of this Agreement:");
  if (isLnd) {
    bul(
      "The Landowner is strictly prohibited from leasing, selling access, or allowing third-party cultivation on this specific land parcel for the duration of the Lease Period.",
    );
    bul(
      "The Investor legally commits to funding the rent for the entirety of the Lease Period unless terminated under Clause 6.",
    );
  } else {
    bul(
      "The Farmer is strictly prohibited from abandoning this project to undertake conflicting agricultural work on or off the Platform.",
    );
    bul(
      "The Investor legally commits the total project budget and cannot unilaterally withdraw funds from Escrow without justified cause as defined in Clause 7.",
    );
  }

  sectionHead(
    isLnd
      ? "CLAUSE 3: OBLIGATIONS OF THE LANDOWNER"
      : "CLAUSE 3: OBLIGATIONS OF THE FARMER",
  );

  if (isLnd) {
    subHead("3.1", "Quiet Enjoyment & Access");
    body(
      "The Landowner shall guarantee the Designated Cultivator uninterrupted access to the land. The Landowner shall not lock gates, block water sources, or harass the Cultivator.",
    );
    subHead("3.2", "Accuracy of Land Details");
    body(
      "The Landowner warrants that the land details (acreage, soil type, water availability, clear legal title) advertised on the Platform are truthful.",
    );
    subHead("3.3", "No Claim to Harvest");
    body(
      "The Landowner explicitly acknowledges that they have no legal right, title, or claim to the crops planted or the final harvest. The harvest belongs entirely to the Investor and/or the Farmer as per their separate agreement.",
    );
    subHead("3.4", "Property Maintenance");
    body(
      "The Landowner is responsible for existing major infrastructure (e.g., repairing a collapsed boundary wall not caused by the Farmer) but is not responsible for day-to-day agricultural maintenance.",
    );
  } else {
    subHead("3.1", "Execution of Labor");
    body(
      "The Farmer shall perform all agricultural activities in accordance with Good Agricultural Practices (GAP) and the timeline specified in the Milestone Schedule.",
    );
    subHead("3.2", "Reporting & Proof of Work");
    body(
      "The Farmer must provide accurate, unmanipulated updates (including date-stamped photographic evidence) via the Aswenna app to claim the completion of each Milestone.",
    );
    subHead("3.3", "Misappropriation");
    body(
      "The Farmer shall not unlawfully sell, divert, or misappropriate any seeds, fertilizers, machinery, or harvest funded by the Investor under this Agreement.",
    );
    subHead("3.4", "Liability for Negligence");
    body(
      "The Farmer is financially liable for project failure only if it is proven to be a direct result of their gross negligence, intentional sabotage, or abandonment.",
    );
  }

  sectionHead("CLAUSE 4: OBLIGATIONS OF THE INVESTOR");

  if (isLnd) {
    subHead("4.1", "Financial Commitment");
    body(
      "The Investor agrees to pay the Monthly Rental amount for the total number of months specified in Part II.",
    );
    subHead("4.2", "Payment Authorization");
    body(
      "The Investor must maintain a valid credit/debit card or bank account linked to the PayHere gateway to allow for automated recurring charges.",
    );
    subHead("4.3", "Liability for the Cultivator");
    body(
      "While the Investor funds the lease, the Investor is not personally liable for physical damages caused to the property by the Farmer. The Landowner must pursue the Farmer directly for malicious property damage under their separate Access Agreement.",
    );
  } else {
    subHead("4.1", "Financial Commitment");
    body(
      "The Investor agrees to fund the project strictly according to the Milestone Schedule (Part II, Section D).",
    );
    subHead("4.2", "Timely Approvals");
    body(
      'Upon the Farmer submitting a "Milestone Completed" notification, the Investor must review the evidence. If the work is completed satisfactorily, the Investor must approve the release of funds within three (3) business days.',
    );
    subHead("4.3", "Unreasonable Withholding");
    body(
      "The Investor may not vexatiously or unreasonably withhold or delay the approval of a Milestone to manipulate the Farmer.",
    );
    subHead("4.4", "Assumption of Agricultural Risk");
    body(
      "The Investor acknowledges that agriculture carries inherent risks. Unless the Farmer is guilty of gross negligence, the Investor bears the financial risk of crop failure due to market price drops or natural disasters.",
    );
  }

  sectionHead(
    isLnd
      ? "CLAUSE 5: FINANCIAL MECHANICS, RECURRING PAYMENTS & FEES"
      : "CLAUSE 5: FINANCIAL MECHANICS, ESCROW & PLATFORM FEES",
  );

  if (isLnd) {
    subHead("5.1", "Automated Billing (Tokenization)");
    body(
      "The Investor authorizes PayHere to securely store their payment credentials and automatically deduct the Monthly Rent every thirty (30) days for the duration of the lease.",
    );
    subHead("5.2", "Split Payments & System Charges");
    body(
      "Upon each successful monthly charge, the Platform's API will automatically deduct the following from the gross rent amount:",
    );
    bul(
      "Payment Gateway Fee: The standard transaction fee levied by PayHere for recurring payments (approximately 2.99%).",
    );
    bul("Platform Commission: A facilitation fee of 0.5% payable to Aswenna.");
    subHead("5.3", "Net Disbursement");
    body(
      "The remaining balance shall be deposited directly into the Landowner's designated bank account immediately after the split.",
    );
    subHead("5.4", "Non-Circumvention");
    body(
      "Arranging offline cash payments for rent to bypass the Aswenna Platform Commission constitutes a material breach, resulting in an immediate platform ban.",
    );
  } else {
    subHead("5.1", "Escrow Protocol");
    body(
      'All project capital provided by the Investor shall be held in a secure trust account managed by PayHere (Aswenna\'s payment gateway). Funds are "locked" and will not be disbursed until milestone conditions are met.',
    );
    subHead("5.2", "Split Payments & System Charges");
    body(
      "Upon the approval of a Milestone, the Platform's API will automatically deduct the following from the gross milestone amount:",
    );
    bul(
      "Payment Gateway Fee: The standard transaction fee levied by PayHere (approximately 2.99%).",
    );
    bul("Platform Commission: A facilitation fee of 0.5% payable to Aswenna.");
    subHead("5.3", "Net Disbursement");
    body(
      "The remaining balance shall be deposited directly into the Farmer's designated bank account.",
    );
    subHead("5.4", "Non-Circumvention");
    body(
      "The Parties shall not attempt to bypass the Platform's payment system to avoid system charges. Doing so constitutes a material breach and will result in immediate termination and a permanent platform ban.",
    );
  }

  sectionHead("CLAUSE 6: DROPPING OUT, DEFAULT, & TERMINATION");

  if (isLnd) {
    subHead("6.1", "Investor Default (Payment Failure)");
    body(
      "If the Investor's automated recurring payment fails, the Platform will attempt to charge the card for three (3) consecutive days. If payment is not secured within seven (7) days, the Investor is in default. The Landowner then reserves the right to terminate the lease and evict the Farmer.",
    );
    subHead("6.2", "Landowner Default (Denial of Access)");
    body(
      "If the Landowner unlawfully locks the farmer out of the property or sells the land mid-lease without transferring this obligation, the Landowner is in material breach. The Landowner must refund all rent paid to date for the current season, and the Platform may initiate legal recovery on behalf of the Investor.",
    );
    subHead("6.3", "Dropping Out (Termination for Convenience)");
    bul(
      "The Investor cannot arbitrarily cancel the lease mid-season without paying a penalty equivalent to two (2) months' rent to the Landowner.",
    );
    bul(
      "The Landowner cannot cancel the lease mid-season under any circumstances, as crops take months to grow and harvest.",
    );
  } else {
    subHead("6.1", "Termination for Cause (Breach)");
    body("A Party is in default if they breach any core obligation.");
    bul(
      "If the Farmer defaults (e.g., abandons the farm, steals the harvest), the Investor may terminate the contract. Unreleased Escrow funds will be refunded to the Investor. The Farmer may be liable for damages.",
    );
    bul(
      "If the Investor defaults (e.g., credit card fails, refuses to release funds for completed work), the Farmer may suspend work. The Platform may manually release Escrow funds to the Farmer for work already completed.",
    );
    subHead("6.2", "Dropping Out (Termination for Convenience)");
    bul(
      "If the Investor wishes to drop out before the project starts, a 5% cancellation penalty will be applied, and the remainder refunded. Once farming begins, the Investor cannot drop out without forfeiting the Escrow funds allocated to active/completed milestones.",
    );
    bul(
      "If the Farmer drops out mid-project without a medical or Force Majeure justification, they forfeit all future payouts and are subject to a platform ban.",
    );
  }

  sectionHead(
    isLnd
      ? "CLAUSE 7: FORCE MAJEURE (DESTRUCTION OF LAND)"
      : "CLAUSE 7: FORCE MAJEURE (CROP FAILURE / ACTS OF GOD)",
  );

  if (isLnd) {
    subHead("7.1", "Natural Disasters");
    body(
      "If the land becomes physically uncultivable or destroyed due to an Act of God (e.g., massive landslide, permanent flooding), the contract is rendered frustrated.",
    );
    subHead("7.2", "Effect on Rent");
    body(
      "The Investor's obligation to pay future monthly rent is immediately paused and terminated. The Landowner retains all rent paid up to the date of the disaster.",
    );
  } else {
    subHead("7.1", "Definition");
    body(
      "If an unforeseeable event beyond the control of the Parties (e.g., severe drought, unprecedented floods, pestilences, state-mandated lockdowns) renders the contract impossible to perform.",
    );
    subHead("7.2", "Effect");
    body("If the crop is destroyed due to a proven Force Majeure event:");
    bul(
      "The Farmer shall not be held financially liable for the Investor's lost capital.",
    );
    bul("The Investor is not required to fund future pending milestones.");
    bul(
      "Funds currently locked in Escrow for incomplete milestones will be refunded to the Investor (minus gateway fees).",
    );
  }

  sectionHead("CLAUSE 8: DISPUTE RESOLUTION & PLATFORM MEDIATION");

  if (isLnd) {
    subHead("8.1", "Platform Mediation");
    body(
      "Any dispute regarding rent collection or land access must first be reported to Aswenna Administration for digital mediation.",
    );
  } else {
    subHead("8.1", "Milestone Rejection");
    body(
      "If the Investor rejects a milestone claim, the funds remain frozen in Escrow.",
    );
    subHead("8.2", "Platform Mediation");
    body(
      "The Parties agree to first submit any dispute to the Aswenna Administration. Aswenna will review in-app chat logs, photos, and system data. Aswenna possesses the discretionary authority to mandate the release of funds to the Farmer or a refund to the Investor based on this evidence.",
    );
  }
  subHead(isLnd ? "8.2" : "8.3", "Governing Law");
  body(
    "This Agreement shall be governed by the laws of Sri Lanka. Unresolved legal disputes shall be subject to arbitration in Colombo under the Arbitration Act No. 11 of 1995.",
  );

  addPage();
  partBanner("PART II: PROJECT SPECIFIC SCHEDULE & BOND");

  doc
    .setFont("helvetica", "italic")
    .setFontSize(8.5)
    .setTextColor(...C.silver);
  y += 9;

  sectionHead("SECTION A: PARTY DETAILS");

  doc
    .setFont("helvetica", "bold")
    .setFontSize(9)
    .setTextColor(...C.charcoal);
  doc.text(
    isLnd ? "The Investor (Lessee Financier):" : "The Investor:",
    ML + 3,
    y,
  );
  y += 6;
  gridRow("Full Name", det.investorName || NA);
  gridRow("NIC / Passport No.", det.investorNIC || NA);
  gridRow("Registered Contact", det.investorContact || NA);
  gap(4);

  doc
    .setFont("helvetica", "bold")
    .setFontSize(9)
    .setTextColor(...C.charcoal);
  doc.text(isLnd ? "The Landowner (Lessor):" : "The Farmer:", ML + 3, y);
  y += 6;
  gridRow("Full Name", det.counterpartyName || NA);
  gridRow("NIC / Passport No.", det.counterpartyNIC || NA);
  gridRow("Registered Contact", det.counterpartyContact || NA);
  gap(2);
  rule(0.3, C.rule);
  gap(5);

  sectionHead(
    isLnd
      ? "SECTION B: PROPERTY & PROJECT SPECIFICATIONS"
      : "SECTION B: PROJECT SPECIFICATIONS",
  );

  const refId =
    det.projectRefId ??
    (isLnd ? "#ASW-INV-LND-[Auto-generated]" : "#ASW-INV-FAR-[Auto-generated]");
  gridRow("Project Reference ID", refId);
  if (isLnd) {
    gridRow("Property Location / Address", det.propertyLocation || NA);
    gridRow("Acreage / Size", det.acreage || NA);
    gridRow("Designated Cultivator (Farmer)", det.designatedCultivator || NA);
    gridRow("Target Crop", det.targetCrop || NA);
  } else {
    gridRow("Target Crop", det.targetCrop || NA);
    gridRow("Land Location / Acreage", det.propertyLocation || NA);
    gridRow("Estimated Start Date", det.estimatedStartDate || NA);
    gridRow("Estimated End Date", det.estimatedEndDate || NA);
  }
  gap(2);
  rule(0.3, C.rule);
  gap(5);

  sectionHead("SECTION C: LEASE TERMS & FINANCIAL SUMMARY");

  const gross = det.grossMonthlyRental ?? 0;
  const inv = det.totalGrossInvestment ?? 0;

  if (isLnd) {
    const total = gross * (det.leaseDurationMonths ?? 0);
    gridRow(
      "Total Lease Duration",
      det.leaseDurationMonths ? `${det.leaseDurationMonths} Months` : NA,
    );
    gridRow("Lease Start Date", det.leaseStartDate || NA);
    gridRow("Lease End Date", det.leaseEndDate || NA);
    gridRow("Gross Monthly Rental", gross ? fmt(gross) : NA);
    gridRow("Total Contract Value", total ? fmt(total) : NA);
  } else {
    gridRow("Total Gross Investment Authorized", inv ? fmt(inv) : NA);
    gridRow("Aswenna Platform Commission Rate", "0.5% per disbursement");
    gridRow("PayHere Gateway Fee Rate", "~2.99% per disbursement");
  }
  gap(2);
  rule(0.3, C.rule);
  gap(5);

  sectionHead(
    isLnd
      ? "SECTION D: AUTOMATED PAYMENT BOND & FEE DEDUCTIONS"
      : "SECTION D: MILESTONE BREAKDOWN & PAYMENT BOND",
  );

  if (isLnd) {
    body(
      "The Investor authorizes the monthly deduction of the Gross Rental Amount. " +
        "The Landowner accepts the following fee deductions prior to receiving the Net Rent.",
    );
    const fee = gross * TOTAL_FEE;
    const net = gross - fee;
    const months = det.leaseDurationMonths ?? 0;
    drawTable(
      [
        "Payment Schedule",
        "Gross Monthly Rent (LKR)",
        "System Fees ~3.49% (LKR)",
        "Net Monthly Rent (LKR)",
      ],
      [48, 46, 46, 50],
      [
        [
          `Every 30 Days (${months || "?"} Months)`,
          gross ? fmt(gross) : NA,
          gross ? fmt(fee) : NA,
          gross ? fmt(net) : NA,
        ],
      ],
    );
  } else {
    body(
      "The Investor authorizes the holding of the Total Gross Investment in Escrow, to be released " +
        "according to the following schedule upon approval of proof of work.",
    );

    const miles: AgreementMilestone[] = det.milestones ?? [
      {
        no: 1,
        task: "Land Clearing & Preparation",
        targetDate: "Not specified",
        grossAmount: 0,
      },
      {
        no: 2,
        task: "Seed Purchasing & Sowing",
        targetDate: "Not specified",
        grossAmount: 0,
      },
      {
        no: 3,
        task: "Fertilizer Application & Weeding",
        targetDate: "Not specified",
        grossAmount: 0,
      },
      {
        no: 4,
        task: "Final Harvest & Market Delivery",
        targetDate: "Not specified",
        grossAmount: 0,
      },
    ];

    let tGross = 0,
      tNet = 0;
    const rows = miles.map((m) => {
      const fee = m.grossAmount * TOTAL_FEE;
      const net = m.grossAmount - fee;
      tGross += m.grossAmount;
      tNet += net;
      return [
        `Milestone ${m.no}`,
        m.task,
        m.targetDate,
        m.grossAmount ? fmt(m.grossAmount) : NA,
        m.grossAmount ? fmt(net) : NA,
      ];
    });

    drawTable(
      [
        "Milestone",
        "Task Description",
        "Target Date",
        "Gross (LKR)",
        "Net to Farmer (LKR)",
      ],
      [24, 62, 30, 34, 40],
      rows,
      ["", "TOTALS", "", tGross ? fmt(tGross) : "—", tNet ? fmt(tNet) : "—"],
    );
  }

  sectionHead("SECTION E: ELECTRONIC EXECUTION & SIGNATURES");

  body(
    "By checking the respective boxes below, the Parties declare that they have read Part I " +
      "(General Legal Conditions) and verify that the data in Part II (Project Specific Schedule) is " +
      "accurate. The Parties intend to be legally bound by this electronic document.",
  );
  gap(4);

  const execBlock = (
    role: string,
    name: string,
    ip: string,
    ts: string,
    commitment: string,
  ) => {
    need(50);
    const bh = 48;

    doc.setFillColor(252, 252, 252);
    doc.setDrawColor(...C.rule).setLineWidth(0.35);
    doc.rect(ML, y, TW, bh, "FD");

    doc.setFillColor(...C.black);
    doc.rect(ML, y, TW, 7, "F");
    doc
      .setFont("helvetica", "bold")
      .setFontSize(8.5)
      .setTextColor(...C.white);
    doc.text(`[FOR THE ${role.toUpperCase()}]`, ML + 5, y + 5);
    y += 11;

    doc.setDrawColor(...C.steel).setLineWidth(0.6);
    doc.rect(ML + 5, y, 4.5, 4.5);

    doc
      .setFont("helvetica", "italic")
      .setFontSize(8.8)
      .setTextColor(...C.ink);
    doc.text(commitment, ML + 13, y + 3.5, { maxWidth: TW - 18 });
    y += 10;

    doc
      .setDrawColor(...C.rule)
      .setLineWidth(0.2)
      .line(ML + 5, y, MR - 5, y);
    y += 5;

    const vc1 = ML + 5;
    const vc2 = ML + 62;
    doc
      .setFont("helvetica", "bold")
      .setFontSize(7.8)
      .setTextColor(...C.steel);
    doc.text("Digitally Verified By:", vc1, y);
    doc.text("IP Address:", vc1, y + 5.5);
    doc.text("Date & Timestamp:", vc1, y + 11);

    doc.setFont("helvetica", "normal").setTextColor(...C.ink);
    doc.text(name, vc2, y);
    doc.text(ip, vc2, y + 5.5);
    doc.text(ts, vc2, y + 11);
    y += 18;

    doc
      .setDrawColor(...C.rule)
      .setLineWidth(0.3)
      .line(ML + 5, y, ML + 90, y);
    doc
      .setFont("helvetica", "normal")
      .setFontSize(6.8)
      .setTextColor(...C.silver);
    doc.text("Authorised Signature / Electronic Acceptance", ML + 5, y + 3);
    y += 8;
  };

  const iCommit = isLnd
    ? "I hereby authorize the automated recurring monthly charge to my designated payment method for the duration of the lease. I understand the drop-out penalties."
    : "I hereby authorize the Total Gross Investment to be placed in Escrow. I agree to the fee deductions and the Milestone Schedule.";

  const cCommit = isLnd
    ? "I hereby commit to providing uninterrupted access to the Designated Cultivator for the duration of the lease. I accept the fee deductions from my monthly rental payouts."
    : "I hereby commit to executing the agricultural tasks listed in the Milestone Schedule. I accept the fee deductions from my payouts.";

  execBlock(
    "Investor",
    det.investorName || NA,
    det.investorIP || NA,
    det.investorTimestamp || nowTS(),
    iCommit,
  );

  gap(4);

  execBlock(
    isLnd ? "Landowner" : "Farmer",
    det.counterpartyName || NA,
    det.counterpartyIP || NA,
    det.counterpartyTimestamp || NA,
    cCommit,
  );

  gap(6);

  need(20);
  doc.setFillColor(...C.black);
  doc.rect(ML, y, TW, 18, "F");
  doc.setFillColor(...C.white).rect(ML, y, 3, 18, "F");

  doc
    .setFont("helvetica", "bold")
    .setFontSize(8.5)
    .setTextColor(...C.white);
  doc.text("IMPORTANT LEGAL NOTICE", ML + 8, y + 7);

  doc
    .setFont("helvetica", "normal")
    .setFontSize(7.8)
    .setTextColor(200, 200, 200);
  doc.text(
    "This is a legally binding document under Sri Lankan law. Both parties are advised to seek independent legal counsel before execution. Non-circumvention applies.",
    ML + 8,
    y + 13,
    { maxWidth: TW - 12 },
  );

  return doc;
}

export function generateLandLeaseAgreementPDF(details: AgreementDetails): void {
  const d = { ...details, agreementType: "Investor-Landowner" as const };
  buildDoc(d).save(
    `Aswenna_LandLease_${(d.projectRefId ?? "DRAFT").replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
  );
}

export function generateCultivationEscrowAgreementPDF(
  details: AgreementDetails,
): void {
  const d = { ...details, agreementType: "Investor-Farmer" as const };
  buildDoc(d).save(
    `Aswenna_CultivationEscrow_${(d.projectRefId ?? "DRAFT").replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
  );
}

export function generateAgreementPDF(details: AgreementDetails): void {
  if (details.agreementType === "Investor-Landowner") {
    generateLandLeaseAgreementPDF(details);
  } else {
    generateCultivationEscrowAgreementPDF(details);
  }
}

export function generateLandLeaseAgreementPDFForPreview(
  details: AgreementDetails,
): jsPDF {
  return buildDoc({ ...details, agreementType: "Investor-Landowner" });
}

export function generateCultivationEscrowAgreementPDFForPreview(
  details: AgreementDetails,
): jsPDF {
  return buildDoc({ ...details, agreementType: "Investor-Farmer" });
}

export function generateAgreementPDFForPreview(
  details: AgreementDetails,
): jsPDF {
  if (details.agreementType === "Investor-Landowner") {
    return generateLandLeaseAgreementPDFForPreview(details);
  }
  return generateCultivationEscrowAgreementPDFForPreview(details);
}
