-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Greenhouse" (
    "id_grenhouse" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "Greenhouse_pkey" PRIMARY KEY ("id_grenhouse")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id_sensor" SERIAL NOT NULL,
    "name" TEXT,
    "unit_measurement" TEXT NOT NULL,
    "brand" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "id_greenhouse" INTEGER NOT NULL,
    "range_min" INTEGER NOT NULL,
    "range_max" INTEGER NOT NULL,
    "id_category_sensor" INTEGER NOT NULL,
    "notify" BOOLEAN NOT NULL,
    "calibration" TEXT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id_sensor")
);

-- CreateTable
CREATE TABLE "CategorySensor" (
    "id_category_sensor" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "CategorySensor_pkey" PRIMARY KEY ("id_category_sensor")
);

-- CreateTable
CREATE TABLE "Actuator" (
    "id_actuator" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status_lifecycle" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "id_greenhouse" INTEGER NOT NULL,

    CONSTRAINT "Actuator_pkey" PRIMARY KEY ("id_actuator")
);

-- CreateTable
CREATE TABLE "Automation" (
    "id_actuator" INTEGER NOT NULL,
    "id_sensor" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "status_lifecycle" INTEGER NOT NULL,
    "id_automation" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "constanta" INTEGER NOT NULL,
    "sensorId_sensor" INTEGER,

    CONSTRAINT "Automation_pkey" PRIMARY KEY ("id_automation")
);

-- CreateTable
CREATE TABLE "ActuatorLog" (
    "id_actuator_log" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "on_off_status" BOOLEAN NOT NULL,
    "id_actuator" INTEGER NOT NULL,
    "actuatorId_actuator" INTEGER,

    CONSTRAINT "ActuatorLog_pkey" PRIMARY KEY ("id_actuator_log")
);

-- CreateTable
CREATE TABLE "Icon" (
    "id_icon" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Icon_pkey" PRIMARY KEY ("id_icon")
);

-- CreateTable
CREATE TABLE "MacAddress" (
    "id_sensor" INTEGER NOT NULL,
    "id_actuator" INTEGER NOT NULL,
    "mac_address" TEXT NOT NULL,
    "id_mac" SERIAL NOT NULL,

    CONSTRAINT "MacAddress_pkey" PRIMARY KEY ("id_mac")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id_notification" SERIAL NOT NULL,
    "detail" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "id_actuator" INTEGER NOT NULL,
    "id_sensor" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id_notification")
);

-- CreateTable
CREATE TABLE "Receive" (
    "id_user" INTEGER NOT NULL,
    "id_notification" INTEGER NOT NULL,
    "id_receive" SERIAL NOT NULL,

    CONSTRAINT "Receive_pkey" PRIMARY KEY ("id_receive")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_brand_key" ON "Sensor"("brand");

-- AddForeignKey
ALTER TABLE "Greenhouse" ADD CONSTRAINT "Greenhouse_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_id_greenhouse_fkey" FOREIGN KEY ("id_greenhouse") REFERENCES "Greenhouse"("id_grenhouse") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_id_category_sensor_fkey" FOREIGN KEY ("id_category_sensor") REFERENCES "CategorySensor"("id_category_sensor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actuator" ADD CONSTRAINT "Actuator_id_greenhouse_fkey" FOREIGN KEY ("id_greenhouse") REFERENCES "Greenhouse"("id_grenhouse") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_id_sensor_fkey" FOREIGN KEY ("id_sensor") REFERENCES "Sensor"("id_sensor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_id_actuator_fkey" FOREIGN KEY ("id_actuator") REFERENCES "Actuator"("id_actuator") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActuatorLog" ADD CONSTRAINT "ActuatorLog_actuatorId_actuator_fkey" FOREIGN KEY ("actuatorId_actuator") REFERENCES "Actuator"("id_actuator") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MacAddress" ADD CONSTRAINT "MacAddress_id_actuator_fkey" FOREIGN KEY ("id_actuator") REFERENCES "Actuator"("id_actuator") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MacAddress" ADD CONSTRAINT "MacAddress_id_sensor_fkey" FOREIGN KEY ("id_sensor") REFERENCES "Sensor"("id_sensor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_id_actuator_fkey" FOREIGN KEY ("id_actuator") REFERENCES "Actuator"("id_actuator") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_id_sensor_fkey" FOREIGN KEY ("id_sensor") REFERENCES "Sensor"("id_sensor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receive" ADD CONSTRAINT "Receive_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receive" ADD CONSTRAINT "Receive_id_notification_fkey" FOREIGN KEY ("id_notification") REFERENCES "Notification"("id_notification") ON DELETE RESTRICT ON UPDATE CASCADE;
