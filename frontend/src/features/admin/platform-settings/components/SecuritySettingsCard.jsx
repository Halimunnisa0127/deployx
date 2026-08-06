import Input from "../../../../components/ui/Input";

export default function SecuritySettingsCard({ register, watch, setValue }) {
  const require2fa = watch("security.require2fa");

  return (
    <div
      id="security"
      className="bg-card rounded-2xl border border-border p-6 shadow-sm dark:shadow-lg mb-10"
    >
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground">Security Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage authentication and access policies.
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Session Timeout (minutes)
            </label>
            <Input
              {...register("security.sessionTimeout")}
              type="number"
              className="w-full bg-card border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              API Rate Limit (req/min)
            </label>
            <Input
              {...register("security.apiRateLimit")}
              type="number"
              className="w-full bg-card border-border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Password Policy
          </label>
          <select
            {...register("security.passwordPolicy")}
            className="w-full h-10 px-3 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            <option value="basic">Basic (8+ chars)</option>
            <option value="medium">
              Medium (8+ chars, 1 number, 1 special)
            </option>
            <option value="strong">
              Strong (12+ chars, mixed case, numbers, special)
            </option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 border border-border rounded-xl">
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-200">
              Enforce Two-Factor Authentication (2FA)
            </div>
            <div className="text-sm text-muted-foreground">
              Require all administrative users to enable 2FA.
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setValue("security.require2fa", !require2fa, {
                shouldDirty: true,
              })
            }
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
              require2fa ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                require2fa ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
