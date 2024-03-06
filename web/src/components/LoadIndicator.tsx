export function LoadIndicator({ loading }: { loading: boolean }) {
  return loading ?
    <svg className="animate-spin h-5 w-5 "
      fill="none"
      viewBox='0 0 24 24'
      stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg> : ''
}