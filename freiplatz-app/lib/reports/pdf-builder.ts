import PDFDocument from "pdfkit";
import { Buffer } from "node:buffer";

export class PdfBuilder {
  private static readonly MARGIN = 56;

  public readonly doc: PDFKit.PDFDocument;

  private readonly chunks: Buffer[] = [];

  private pageWidth = 0;

  private contentWidth = 0;

  constructor() {
    this.doc = new PDFDocument({
      size: "A4",
      autoFirstPage: false,
      bufferPages: true,
      compress: true,
      margins: {
        top: PdfBuilder.MARGIN,
        bottom: PdfBuilder.MARGIN,
        left: PdfBuilder.MARGIN,
        right: PdfBuilder.MARGIN,
      },
      info: {
        Title: "JugendKompass Fallbericht",
        Author: "JugendKompass",
        Subject: "Fallbericht",
        Creator: "JugendKompass",
      },
    });
  }

  public async init(): Promise<void> {
    this.doc.on("data", (chunk: Buffer) => {
      this.chunks.push(chunk);
    });

    this.doc.addPage();

    this.pageWidth =
      this.doc.page.width -
      PdfBuilder.MARGIN * 2;

    this.contentWidth =
      this.pageWidth;

    this.bodyFont();
  }

  public async save(): Promise<Buffer> {
    this.drawPageNumbers();

    return new Promise<Buffer>((resolve) => {
      this.doc.on("end", () => {
        resolve(Buffer.concat(this.chunks));
      });

      this.doc.end();
    });
  }

  public title(text: string): void {
    this.ensureSpace(80);

    this.doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#111111")
      .text(text, {
        width: this.contentWidth,
      });

    this.doc.moveDown(0.8);

    this.divider();

    this.doc.moveDown(0.5);

    this.bodyFont();
  }

  public section(title: string): void {
    this.ensureSpace(42);

    this.doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#111111")
      .text(title);

    this.doc.moveDown(0.5);

    this.bodyFont();
  }

  public paragraph(text: string): void {
    this.ensureSpace(24);

    this.bodyFont();

    this.doc.text(text, {
      width: this.contentWidth,
      align: "left",
      lineGap: 3,
    });

    this.doc.moveDown(0.8);
  }

  public divider(): void {
    this.ensureSpace(12);

    const y = this.doc.y;

    this.doc
      .save()
      .lineWidth(0.5)
      .strokeColor("#D9D9D9")
      .moveTo(
        PdfBuilder.MARGIN,
        y,
      )
      .lineTo(
        this.doc.page.width -
          PdfBuilder.MARGIN,
        y,
      )
      .stroke()
      .restore();

    this.doc.moveDown();
  }

   public labelValue(
  label: string,
  value: unknown,
): void {
  const labelWidth = 170;
  const columnGap = 16;

  const labelText = this.normalize(label);
  const valueText = this.normalize(value);

  const valueWidth =
    this.contentWidth -
    labelWidth -
    columnGap;

  const labelHeight = this.measureHeight(
    labelText,
    "Helvetica-Bold",
    10,
    labelWidth,
  );

  const valueHeight = this.measureHeight(
    valueText,
    "Helvetica",
    10,
    valueWidth,
  );

  const rowHeight =
    Math.max(labelHeight, valueHeight) + 8;

  this.ensureSpace(rowHeight);

  const x = PdfBuilder.MARGIN;
  const y = this.doc.y;

  this.labelFont();

  this.doc.text(
    labelText,
    x,
    y,
    {
      width: labelWidth,
      lineGap: 2,
    },
  );

  this.bodyFont();

  this.doc.text(
    valueText,
    x + labelWidth + columnGap,
    y,
    {
      width: valueWidth,
      lineGap: 2,
    },
  );

  this.doc.y = y + rowHeight;
}
  public pageBreak(): void {
    this.doc.addPage();
    this.bodyFont();
  }

  public timelineCard(
    type: string,
    date: string,
    title: string,
    description: string,
  ): void {
    const padding = 12;
    const radius = 6;
    const width = this.contentWidth;

    const meta =
      `${type} • ${date}`;

    const titleHeight =
      this.measureHeight(
        title,
        "Helvetica-Bold",
        11,
        width - padding * 2,
      );

    const metaHeight =
      this.measureHeight(
        meta,
        "Helvetica",
        9,
        width - padding * 2,
      );

    const descriptionHeight =
      this.measureHeight(
        description,
        "Helvetica",
        10,
        width - padding * 2,
      );

    const cardHeight =
      padding * 2 +
      titleHeight +
      metaHeight +
      descriptionHeight +
      20;

    this.ensureSpace(cardHeight + 10);

    const x = PdfBuilder.MARGIN;
    const y = this.doc.y;

    this.doc
      .save()
      .roundedRect(
        x,
        y,
        width,
        cardHeight,
        radius,
      )
      .lineWidth(0.8)
      .strokeColor("#D8D8D8")
      .stroke()
      .restore();

    let cursor = y + padding;

    this.timelineTitleFont();

    this.doc.text(
      title,
      x + padding,
      cursor,
      {
        width:
          width - padding * 2,
      },
    );

    cursor = this.doc.y + 2;

    this.timelineMetaFont();

    this.doc.text(
      meta,
      x + padding,
      cursor,
      {
        width:
          width - padding * 2,
      },
    );

    cursor = this.doc.y + 6;

    this.timelineBodyFont();

    this.doc.text(
      this.normalize(description),
      x + padding,
      cursor,
      {
        width:
          width - padding * 2,
      },
    );

    this.doc.y =
      y + cardHeight + 10;

    this.bodyFont();
  }

    // ---------------------------------------------------------------------------
  // Layout helpers
  // ---------------------------------------------------------------------------

  private ensureSpace(requiredHeight: number): void {
    const bottom =
      this.doc.page.height -
      this.doc.page.margins.bottom;

    if (this.doc.y + requiredHeight > bottom) {
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
    align: "left",
    lineGap: 2,
  });

  this.bodyFont();

  return height;
}

  private normalize(value: unknown): string {
    if (
      value === null ||
      value === undefined
    ) {
      return "—";
    }

    const text = String(value).trim();

    return text.length === 0
      ? "—"
      : text;
  }

  private move(spacing = 0.6): void {
    this.doc.moveDown(spacing);
  }

  private lineWidth(): number {
    return this.contentWidth;
  }

  private pageBottom(): number {
    return (
      this.doc.page.height -
      this.doc.page.margins.bottom
    );
  }

  private remainingSpace(): number {
    return (
      this.pageBottom() -
      this.doc.y
    );
  }

    // ---------------------------------------------------------------------------
  // Typography helpers
  // ---------------------------------------------------------------------------

  private bodyFont(): void {
    this.doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#111111");
  }

  private labelFont(): void {
    this.doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#111111");
  }

  private sectionFont(): void {
    this.doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#111111");
  }

  private titleFont(): void {
    this.doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#111111");
  }

  private timelineTitleFont(): void {
    this.doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#111111");
  }

  private timelineMetaFont(): void {
    this.doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#666666");
  }

  private timelineBodyFont(): void {
    this.doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#111111");
  }

  private footerFont(): void {
    this.doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#666666");
  }

  // ---------------------------------------------------------------------------
  // Footer
  // ---------------------------------------------------------------------------

  private drawPageNumbers(): void {
    const range = this.doc.bufferedPageRange();

    if (range.count === 0) {
      return;
    }

    for (let page = 0; page < range.count; page++) {
      this.doc.switchToPage(page);

      this.footerFont();

      this.doc.text(
        `Seite ${page + 1} von ${range.count}`,
        PdfBuilder.MARGIN,
        this.doc.page.height -
          this.doc.page.margins.bottom +
          18,
        {
          width: this.contentWidth,
          align: "center",
        },
      );
    }

    this.doc.switchToPage(range.count - 1);

    this.bodyFont();
  }

    // ---------------------------------------------------------------------------
  // Drawing helpers
  // ---------------------------------------------------------------------------

  private drawBox(
    x: number,
    y: number,
    width: number,
    height: number,
    radius = 6,
  ): void {
    this.doc
      .save()
      .roundedRect(
        x,
        y,
        width,
        height,
        radius,
      )
      .lineWidth(0.8)
      .strokeColor("#D8D8D8")
      .stroke()
      .restore();
  }

  private drawHorizontalLine(): void {
    const y = this.doc.y;

    this.doc
      .save()
      .lineWidth(0.5)
      .strokeColor("#D9D9D9")
      .moveTo(
        PdfBuilder.MARGIN,
        y,
      )
      .lineTo(
        this.doc.page.width -
          PdfBuilder.MARGIN,
        y,
      )
      .stroke()
      .restore();
  }

  private availableWidth(): number {
    return (
      this.doc.page.width -
      PdfBuilder.MARGIN * 2
    );
  }

  private contentLeft(): number {
    return PdfBuilder.MARGIN;
  }

  private contentRight(): number {
    return (
      this.doc.page.width -
      PdfBuilder.MARGIN
    );
  }

  private resetFont(): void {
    this.bodyFont();
  }

  private beginBlock(
    minimumHeight = 24,
  ): void {
    this.ensureSpace(
      minimumHeight,
    );
  }

  private endBlock(
    spacing = 0.7,
  ): void {
    this.doc.moveDown(
      spacing,
    );
  }

  private writeText(
    text: string,
    x: number,
    y: number,
    width: number,
  ): void {
    this.doc.text(
      text,
      x,
      y,
      {
        width,
        align: "left",
        lineGap: 2,
      },
    );
  }

    // ---------------------------------------------------------------------------
  // Drawing helpers
  // ---------------------------------------------------------------------------

  private drawBox(
    x: number,
    y: number,
    width: number,
    height: number,
    radius = 6,
  ): void {
    this.doc
      .save()
      .roundedRect(
        x,
        y,
        width,
        height,
        radius,
      )
      .lineWidth(0.8)
      .strokeColor("#D8D8D8")
      .stroke()
      .restore();
  }

  private drawHorizontalLine(): void {
    const y = this.doc.y;

    this.doc
      .save()
      .lineWidth(0.5)
      .strokeColor("#D9D9D9")
      .moveTo(
        PdfBuilder.MARGIN,
        y,
      )
      .lineTo(
        this.doc.page.width -
          PdfBuilder.MARGIN,
        y,
      )
      .stroke()
      .restore();
  }

  private availableWidth(): number {
    return (
      this.doc.page.width -
      PdfBuilder.MARGIN * 2
    );
  }

  private contentLeft(): number {
    return PdfBuilder.MARGIN;
  }

  private contentRight(): number {
    return (
      this.doc.page.width -
      PdfBuilder.MARGIN
    );
  }

  private resetFont(): void {
    this.bodyFont();
  }

  private beginBlock(
    minimumHeight = 24,
  ): void {
    this.ensureSpace(
      minimumHeight,
    );
  }

  private endBlock(
    spacing = 0.7,
  ): void {
    this.doc.moveDown(
      spacing,
    );
  }

  private writeText(
    text: string,
    x: number,
    y: number,
    width: number,
  ): void {
    this.doc.text(
      text,
      x,
      y,
      {
        width,
        align: "left",
        lineGap: 2,
      },
    );
  }

    // ---------------------------------------------------------------------------
  // Page metrics
  // ---------------------------------------------------------------------------

  private pageHeight(): number {
    return this.doc.page.height;
  }

  private contentTop(): number {
    return this.doc.page.margins.top;
  }

  private contentBottom(): number {
    return (
      this.doc.page.height -
      this.doc.page.margins.bottom
    );
  }

  private contentHeight(): number {
    return (
      this.contentBottom() -
      this.contentTop()
    );
  }

  private isNearPageEnd(
    requiredHeight: number,
  ): boolean {
    return (
      this.doc.y + requiredHeight >
      this.contentBottom()
    );
  }

  // ---------------------------------------------------------------------------
  // Generic drawing primitives
  // ---------------------------------------------------------------------------

  private drawLabel(
    text: string,
    x: number,
    y: number,
    width: number,
  ): void {
    this.labelFont();

    this.doc.text(
      this.normalize(text),
      x,
      y,
      {
        width,
      },
    );

    this.bodyFont();
  }

  private drawValue(
    text: string,
    x: number,
    y: number,
    width: number,
  ): void {
    this.bodyFont();

    this.doc.text(
      this.normalize(text),
      x,
      y,
      {
        width,
      },
    );
  }

  private drawMuted(
    text: string,
    x: number,
    y: number,
    width: number,
  ): void {
    this.timelineMetaFont();

    this.doc.text(
      this.normalize(text),
      x,
      y,
      {
        width,
      },
    );

    this.bodyFont();
  }

  // ---------------------------------------------------------------------------
  // Reset helpers
  // ---------------------------------------------------------------------------

  private resetState(): void {
    this.bodyFont();
    this.doc.fillColor("#111111");
  }

  private beginSection(): void {
    this.resetState();
  }

  private finishSection(): void {
    this.resetState();
    this.doc.moveDown(0.5);
  }

    // ---------------------------------------------------------------------------
  // Validation helpers
  // ---------------------------------------------------------------------------

  private hasContent(value: unknown): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return true;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  // ---------------------------------------------------------------------------
  // Common spacing
  // ---------------------------------------------------------------------------

  private spaceSmall(): void {
    this.doc.moveDown(0.3);
  }

  private spaceMedium(): void {
    this.doc.moveDown(0.6);
  }

  private spaceLarge(): void {
    this.doc.moveDown(1.0);
  }

  // ---------------------------------------------------------------------------
  // Public utility methods
  // ---------------------------------------------------------------------------

  public currentPage(): number {
    const range = this.doc.bufferedPageRange();

    return range.start + 1;
  }

  public totalPages(): number {
    return this.doc.bufferedPageRange().count;
  }

  public cursorY(): number {
    return this.doc.y;
  }

  public setCursorY(y: number): void {
    this.doc.y = Math.max(
      this.doc.page.margins.top,
      Math.min(
        y,
        this.doc.page.height - this.doc.page.margins.bottom,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Low-level text writer
  // ---------------------------------------------------------------------------

  private write(
    text: string,
    options?: PDFKit.Mixins.TextOptions,
  ): void {
    this.doc.text(
      this.normalize(text),
      options ?? {},
    );
  }

    // ---------------------------------------------------------------------------
  // Common document helpers
  // ---------------------------------------------------------------------------

  public newLine(lines = 1): void {
    this.doc.moveDown(lines);
  }

  public currentPosition(): {
    x: number;
    y: number;
  } {
    return {
      x: PdfBuilder.MARGIN,
      y: this.doc.y,
    };
  }

  public contentBounds() {
    return {
      left: PdfBuilder.MARGIN,
      top: this.doc.page.margins.top,
      right:
        this.doc.page.width -
        PdfBuilder.MARGIN,
      bottom:
        this.doc.page.height -
        this.doc.page.margins.bottom,
      width: this.contentWidth,
      height:
        this.doc.page.height -
        this.doc.page.margins.top -
        this.doc.page.margins.bottom,
    };
  }

  // ---------------------------------------------------------------------------
  // Internal state helpers
  // ---------------------------------------------------------------------------

  private beginWrite(requiredHeight = 20): void {
    this.ensureSpace(requiredHeight);
    this.resetState();
  }

  private finishWrite(spacing = 0.5): void {
    this.resetState();
    this.doc.moveDown(spacing);
  }

  private resetFill(): void {
    this.doc.fillColor("#111111");
  }

  private resetStroke(): void {
    this.doc.strokeColor("#000000");
    this.doc.lineWidth(1);
  }

  private resetGraphicsState(): void {
    this.resetFill();
    this.resetStroke();
    this.bodyFont();
  }

  // ---------------------------------------------------------------------------
  // Future extension points
  // ---------------------------------------------------------------------------

  /**
   * Reserved for a future cover page implementation.
   */
  protected beforeFirstSection(): void {
    // intentionally empty
  }

  /**
   * Reserved for future logo rendering.
   */
  protected drawLogo(): void {
    // intentionally empty
  }

  /**
   * Reserved for future header rendering.
   */
  protected drawHeader(): void {
    // intentionally empty
  }

  /**
   * Reserved for future footer enhancements.
   */
  protected drawFooter(): void {
    // intentionally empty
  }

    // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  public dispose(): void {
    this.chunks.length = 0;
  }
}
