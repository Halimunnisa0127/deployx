import React from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import { Mail } from "lucide-react";

export default function EmailSettingsCard({ register, errors, onTestEmail }) {
  return (
    <div
      id="email"
      className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm dark:shadow-lg"
    >
      <div className="mb-6 border-b border-slate-200 dark:border-slate-800/80 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Email Configuration (SMTP)
          </h2>
          <p className="text-sm text-slate-400">
            Configure outbound email server settings.
          </p>
        </div>
        <Button
          variant="secondary"
          iconLeft={<Mail className="w-4 h-4" />}
          onClick={onTestEmail}
        >
          Send Test Email
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            SMTP Host <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register("email.smtpHost")}
            placeholder="smtp.example.com"
            className="w-full bg-slate-900 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20"
          />

          {errors?.email?.smtpHost && (
            <p className="mt-1.5 text-sm text-rose-500">
              {errors.email.smtpHost.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Port <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register("email.port")}
            placeholder="587"
            className="w-full bg-slate-900 border-slate-700"
          />

          {errors?.email?.port && (
            <p className="mt-1.5 text-sm text-rose-500">
              {errors.email.port.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Encryption
          </label>
          <select
            {...register("email.encryption")}
            className="w-full h-10 px-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            <option value="none">None</option>
            <option value="ssl">SSL</option>
            <option value="tls">TLS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Sender Name
          </label>
          <Input
            {...register("email.senderName")}
            placeholder="DeployX Admin"
            className="w-full bg-slate-900 border-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Sender Email <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register("email.senderEmail")}
            placeholder="admin@deployx.example.com"
            className="w-full bg-slate-900 border-slate-700"
          />

          {errors?.email?.senderEmail && (
            <p className="mt-1.5 text-sm text-rose-500">
              {errors.email.senderEmail.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Username
          </label>
          <Input
            {...register("email.username")}
            placeholder="SMTP Username"
            className="w-full bg-slate-900 border-slate-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Password
          </label>
          <Input
            type="password"
            {...register("email.password")}
            placeholder="••••••••••••"
            className="w-full bg-slate-900 border-slate-700"
          />
        </div>
      </div>
    </div>
  );
}
