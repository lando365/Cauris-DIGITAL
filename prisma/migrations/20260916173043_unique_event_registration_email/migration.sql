-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_eventId_email_key" ON "event_registrations"("eventId", "email");
