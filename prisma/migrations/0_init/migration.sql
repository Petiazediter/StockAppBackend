-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordedStockPrice" (
    "id" TEXT NOT NULL,
    "idStock" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RecordedStockPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_key" ON "Stock"("symbol");

-- AddForeignKey
ALTER TABLE "RecordedStockPrice" ADD CONSTRAINT "RecordedStockPrice_idStock_fkey" FOREIGN KEY ("idStock") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

