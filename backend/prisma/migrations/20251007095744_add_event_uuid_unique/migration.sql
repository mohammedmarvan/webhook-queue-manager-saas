/*
  Warnings:

  - A unique constraint covering the columns `[eventUid]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_eventUid_key" ON "Event"("eventUid");
