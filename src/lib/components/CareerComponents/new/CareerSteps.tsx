import '@/lib/styles/forms/career-steps.scss';

const steps = [
  { label: 'Career Details & Team Access', status: 'completed' },
  { label: 'CV Review & Pre-screening', status: 'current' },
  { label: 'AI Interview Setup', status: 'upcoming' },
  { label: 'Pipeline Stages', status: 'upcoming' },
  { label: 'Review Career', status: 'upcoming' },
]

export default function CareerSteps() {
  return (
    <div className="career-steps">
      {steps.map(({ label, status }, index) => (
        <div key={label} className="career-steps__step">
          <div className="career-steps__step__top">
            <div className="career-steps__step__circle">
              <StepCircle className="career-steps__step__circle__icon" />
            </div>
            {index < steps.length - 1 && (
              <div className="career-steps__step__line" />
            )}
          </div>
          <div className="career-steps__step__label">{label}</div>
        </div>
      ))}
    </div>
  )
}

function StepCircle({ className }: React.HTMLAttributes<SVGElement>) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill='none' xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M8.33333 0C3.74167 0 0 3.74167 0 8.33333C0 12.925 3.74167 16.6667 8.33333 16.6667C12.925 16.6667 16.6667 12.925 16.6667 8.33333C16.6667 3.74167 12.925 0 8.33333 0ZM8.33333 15C4.65833 15 1.66667 12.0083 1.66667 8.33333C1.66667 4.65833 4.65833 1.66667 8.33333 1.66667C12.0083 1.66667 15 4.65833 15 8.33333C15 12.0083 12.0083 15 8.33333 15ZM10.8333 8.33333C10.8333 9.71667 9.71667 10.8333 8.33333 10.8333C6.95 10.8333 5.83333 9.71667 5.83333 8.33333C5.83333 6.95 6.95 5.83333 8.33333 5.83333C9.71667 5.83333 10.8333 6.95 10.8333 8.33333Z"
      />
    </svg>
  )
}

function StepError() {
  return (
    <svg width="20" height="17" viewBox="0 0 20 17" stroke='#ff0000' fill='none' xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.54164 5.92058V9.25391M9.54164 12.5872H9.54998M8.11664 1.63725L1.05831 13.4206C0.912783 13.6726 0.835782 13.9583 0.834967 14.2493C0.834153 14.5404 0.909552 14.8265 1.05367 15.0794C1.19778 15.3322 1.40558 15.5429 1.6564 15.6905C1.90722 15.838 2.19231 15.9174 2.48331 15.9206H16.6C16.891 15.9174 17.1761 15.838 17.4269 15.6905C17.6777 15.5429 17.8855 15.3322 18.0296 15.0794C18.1737 14.8265 18.2491 14.5404 18.2483 14.2493C18.2475 13.9583 18.1705 13.6726 18.025 13.4206L10.9666 1.63725C10.8181 1.39234 10.6089 1.18985 10.3593 1.04932C10.1097 0.908788 9.82809 0.834961 9.54164 0.834961C9.2552 0.834961 8.97359 0.908788 8.72398 1.04932C8.47438 1.18985 8.2652 1.39234 8.11664 1.63725Z"
        stroke="#F04438" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  )
}
