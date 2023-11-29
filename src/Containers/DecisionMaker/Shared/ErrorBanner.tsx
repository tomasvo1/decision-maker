export function ErrorBanner({ error }: { error?: string }) {
  if (!error) {
    return null
  }

  return (
    <div className="decision-maker__form-error-banner">
      {error}
    </div>
  )
}
