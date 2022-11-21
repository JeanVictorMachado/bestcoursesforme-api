/*
  Warnings:

  - Added the required column `expires_token` to the `user_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_tokens" ADD COLUMN     "expires_token" TIMESTAMP(3) NOT NULL;
