import PDFDocument from "pdfkit";

import path from "path";

const logoPath = path.join(
  process.cwd(),
  "public",
  "logo.png",
);

export class PdfBuilder {
  private static readonly MARGIN = 50;

  private static readonly TITLE_SIZE = 22;
  private static readonly SECTION_SIZE = 16;
  private static readonly BODY_SIZE = 10.5;
  private static readonly LABEL_SIZE = 10;
  private static readonly FOOTER_SIZE = 9;
  private caseNumber = "";
  private static readonly HEADER_Y = 10;
private static readonly HEADER_LINE_Y = 72;

  private readonly doc: PDFKit.PDFDocument;

  private readonly chunks: Buffer[] = [];

  private readonly contentWidth: number;

  private drawHeader(): void {
  const pages =
    this.doc.bufferedPageRange();

  const logoPath = path.join(
    process.cwd(),
    "public",
    "logo.png",
  );

  const created =
    new Intl.DateTimeFormat(
      "de-DE",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    ).format(new Date());

  for (let i = 0; i < pages.count; i++) {
    this.doc.switchToPage(i);

    const page = this.doc.page;

    const headerY =
  PdfBuilder.HEADER_Y;

    // Logo
    this.doc.image(
      logoPath,
      PdfBuilder.MARGIN,
      headerY - 5,
      {
        height: 75,
      },
    );

    // Date
    this.footerFont();

    this.doc.text(
  `Erstellt am: ${created}`,
  page.width - PdfBuilder.MARGIN - 180,
  headerY + 40,
  {
    width: 180,
    align: "right",
    lineBreak: false,
  },
);

    // Divider
    this.doc
      .save()
      .lineWidth(0.5)
      .strokeColor("#D9D9D9")
      .moveTo(
  PdfBuilder.MARGIN,
  PdfBuilder.HEADER_LINE_Y,
)
.lineTo(
  page.width - PdfBuilder.MARGIN,
  PdfBuilder.HEADER_LINE_Y,
)
      .stroke()
      .restore();
  }

  this.doc.switchToPage(
    pages.count - 1,
  );
}

  public constructor() {
    this.doc = new PDFDocument({
  size: "A4",
  margins: {
    top: 100,
    bottom: 60,
    left: 50,
    right: 50,
  },
  bufferPages: true,
  compress: true,
});

    this.contentWidth =
      this.doc.page.width -
      PdfBuilder.MARGIN * 2;

    this.doc.on("data", (chunk: Buffer) => {
      this.chunks.push(chunk);

    });

  }
public async init(): Promise<void> {
  this.bodyFont();
}

public async save(): Promise<Buffer> {
  this.drawHeader();
this.drawFooter();

  return new Promise<Buffer>((resolve, reject) => {
    this.doc.once("end", () => {
      resolve(Buffer.concat(this.chunks));
    });

    this.doc.once("error", reject);

    this.doc.end();
  });
}
private bodyFont(): void {
  this.doc
    .font("Helvetica")
    .fontSize(PdfBuilder.BODY_SIZE)
    .fillColor("#111111");
}

private headingFont(): void {
  this.doc
    .font("Helvetica-Bold")
    .fontSize(PdfBuilder.SECTION_SIZE)
    .fillColor("#111111");
}

private titleFont(): void {
  this.doc
    .font("Helvetica-Bold")
    .fontSize(PdfBuilder.TITLE_SIZE)
    .fillColor("#111111");
}

private labelFont(): void {
  this.doc
    .font("Helvetica-Bold")
    .fontSize(PdfBuilder.LABEL_SIZE)
    .fillColor("#111111");
}

private footerFont(): void {
  this.doc
    .font("Helvetica")
    .fontSize(PdfBuilder.FOOTER_SIZE)
    .fillColor("#666666");
}

public setCaseNumber(
  caseNumber: string,
): void {
  this.caseNumber = caseNumber;
}

public title(text: string): void {
  this.ensureSpace(50);

  this.titleFont();

  this.doc.text(text, {
    align: "left",
  });

  this.doc.moveDown(1);

  this.bodyFont();
}

public section(title: string): void {
  this.ensureSpace(40);

  this.doc
    .lineWidth(0.75)
    .strokeColor("#D9D9D9")
    .moveTo(
      PdfBuilder.MARGIN,
      this.doc.y,
    )
    .lineTo(
      this.doc.page.width -
        PdfBuilder.MARGIN,
      this.doc.y,
    )
    .stroke();

  this.doc.moveDown(0.8);

  this.headingFont();

  this.doc.text(
  title.toUpperCase(),
  PdfBuilder.MARGIN,
  this.doc.y,
  {
    width: this.contentWidth,
    align: "left",
  },
);

  this.doc.moveDown(0.6);

  this.bodyFont();
}

public paragraph(
  text: string,
): void {
  if (!text?.trim()) {
    return;
  }

  this.bodyFont();

  const height = this.measureHeight(
    text,
    "Helvetica",
    PdfBuilder.BODY_SIZE,
    this.contentWidth,
  );

  this.ensureSpace(height + 8);

  this.doc.text(
    text,
    PdfBuilder.MARGIN,
    this.doc.y,
    {
        width: this.contentWidth,
        align: "left",
        lineGap: 2,
    },
);

  this.doc.moveDown(0.8);
}

public divider(): void {
  this.ensureSpace(12);

  this.doc
    .save()
    .lineWidth(0.5)
    .strokeColor("#E5E5E5")
    .moveTo(
      PdfBuilder.MARGIN,
      this.doc.y,
    )
    .lineTo(
      this.doc.page.width -
        PdfBuilder.MARGIN,
      this.doc.y,
    )
    .stroke()
    .restore();

  this.doc.moveDown(1);
}

private ensureSpace(
  requiredHeight: number,
): void {
  const remaining =
    this.doc.page.height -
    this.doc.page.margins.bottom -
    this.doc.y;

  if (remaining < requiredHeight) {
    this.pageBreak();
  }
}

private measureHeight(
  text: string,
  font: string,
  size: number,
  width: number,
): number {
  if (!text) {
    return 0;
  }

  this.doc.font(font);
  this.doc.fontSize(size);

  const height = this.doc.heightOfString(text, {
    width,
    lineGap: 2,
  });

  // Restore the default body font instead of trying
  // to restore an internal PDFKit font object.
  this.bodyFont();

  return height;

}

private normalize(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  const text =
    String(value).trim();

  return text.length === 0
    ? "—"
    : text;
}

public pageBreak(): void {
  this.doc.addPage();

  this.bodyFont();
}

public labelValue(
  label: string,
  value: unknown,
): void {
  const labelWidth = 160;
  const gap = 20;

  const labelText =
    this.normalize(label);

  const valueText =
    this.normalize(value);

  const valueWidth =
    this.contentWidth -
    labelWidth -
    gap;

  const labelHeight =
    this.measureHeight(
      labelText,
      "Helvetica-Bold",
      PdfBuilder.LABEL_SIZE,
      labelWidth,
    );

  const valueHeight =
    this.measureHeight(
      valueText,
      "Helvetica",
      PdfBuilder.BODY_SIZE,
      valueWidth,
    );

  const rowHeight =
    Math.max(
      labelHeight,
      valueHeight,
    ) + 6;

  this.ensureSpace(rowHeight);

  const startY = this.doc.y;

  this.labelFont();

  this.doc.text(
    labelText,
    PdfBuilder.MARGIN,
    startY,
    {
      width: labelWidth,
    },
  );

  this.bodyFont();

  this.doc.text(
    valueText,
    PdfBuilder.MARGIN +
      labelWidth +
      gap,
    startY,
    {
      width: valueWidth,
    },
  );

  this.doc.y =
    startY + rowHeight;
}

public timelineCard(
  type: string,
  date: string,
  title: string,
  description: string,
): void {
  const typeLabels: Record<string, string> = {
    case: "FALL",
    note: "VERLAUFSNOTIZ",
    incident: "VORFALL",
    document: "DOKUMENT",
  };

  const badge =
    typeLabels[type] ??
    type.toUpperCase();

  const titleText =
    this.normalize(title);

  const descriptionText =
    this.normalize(description);

  const titleHeight =
    this.measureHeight(
      titleText,
      "Helvetica-Bold",
      11,
      this.contentWidth - 24,
    );

  const descriptionHeight =
    this.measureHeight(
      descriptionText,
      "Helvetica",
      PdfBuilder.BODY_SIZE,
      this.contentWidth - 24,
    );

  const cardHeight =
    titleHeight +
    descriptionHeight +
    42;

  this.ensureSpace(cardHeight);

  const x = PdfBuilder.MARGIN;
  const y = this.doc.y;

  // Card border
  this.doc
    .save()
    .roundedRect(
      x,
      y,
      this.contentWidth,
      cardHeight,
      6,
    )
    .lineWidth(0.5)
    .strokeColor("#D9D9D9")
    .stroke()
    .restore();

  // Badge
  this.labelFont();

  this.doc.text(
    badge,
    x + 12,
    y + 10,
  );

  // Date
  this.footerFont();

  this.doc.text(
    date,
    x,
    y + 10,
    {
      width: this.contentWidth - 12,
      align: "right",
    },
  );

  // Title
  this.doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#111111");

  this.doc.text(
    titleText,
    x + 12,
    y + 28,
    {
      width: this.contentWidth - 24,
    },
  );

  // Description
  this.bodyFont();

  this.doc.text(
    descriptionText,
    x + 12,
    this.doc.y + 4,
    {
      width: this.contentWidth - 24,
      lineGap: 2,
    },
  );

  this.doc.y =
    y + cardHeight + 10;
}

private drawFooter(): void {
  const pages =
    this.doc.bufferedPageRange();

  for (
    let i = 0;
    i < pages.count;
    i++
  ) {
    this.doc.switchToPage(i);

    const page = this.doc.page;

    const lineY =
  page.height - page.margins.bottom - 18;

const textY =
  lineY + 6;

    this.doc
      .save()
      .lineWidth(0.5)
      .strokeColor("#D9D9D9")
      .moveTo(
        PdfBuilder.MARGIN,
        lineY,
      )
      .lineTo(
        page.width -
          PdfBuilder.MARGIN,
        lineY,
      )
      .stroke()
      .restore();

    this.footerFont();

this.doc.text(
  `Fallakte: ${this.caseNumber}`,
  PdfBuilder.MARGIN,
  textY,
  {
    width: 250,
    align: "left",
  },
);

this.doc.text(
  `Seite ${i + 1} von ${pages.count}`,
  page.width - PdfBuilder.MARGIN - 100,
  textY,
  {
    width: 100,
    align: "right",
  },
);

} // end for loop

this.doc.switchToPage(
  pages.count - 1,
);

this.bodyFont();

} // end drawFooter()

} // end class PdfBuilder