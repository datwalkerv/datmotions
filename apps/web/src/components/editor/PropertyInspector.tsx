'use client'
import React from 'react'
import type { TemplateDefinition, PropertyField } from '@datmotions/motion-engine'

interface PropertyInspectorProps {
  template: TemplateDefinition<Record<string, unknown>>
  props: Record<string, unknown>
  onPropChange: (key: string, value: unknown) => void
}

export function PropertyInspector({ template, props, onPropChange }: PropertyInspectorProps) {
  const groups = new Map<string, PropertyField[]>()
  for (const field of template.schema) {
    if (!groups.has(field.group)) groups.set(field.group, [])
    groups.get(field.group)!.push(field)
  }

  return (
    <div className="p-4 flex flex-col gap-1">
      <p className="text-xs font-medium text-text-muted uppercase tracking-widest mb-3">
        Properties
      </p>
      {Array.from(groups.entries()).map(([group, fields]) => (
        <PropertyGroup
          key={group}
          group={group}
          fields={fields}
          props={props}
          onPropChange={onPropChange}
        />
      ))}
    </div>
  )
}

function PropertyGroup({
  group,
  fields,
  props,
  onPropChange,
}: {
  group: string
  fields: PropertyField[]
  props: Record<string, unknown>
  onPropChange: (key: string, value: unknown) => void
}) {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="rounded-lg border border-border overflow-hidden mb-2">
      <button
        className="w-full flex items-center justify-between px-3 py-2 bg-canvas-subtle hover:bg-canvas-raised transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {group}
        </span>
        <span className="text-text-muted text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-3 py-3 flex flex-col gap-3 bg-canvas">
          {fields.map((field) => (
            <PropertyControl
              key={field.key}
              field={field}
              value={props[field.key]}
              onChange={(v) => onPropChange(field.key, v)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PropertyControl({
  field,
  value,
  onChange,
}: {
  field: PropertyField
  value: unknown
  onChange: (v: unknown) => void
}) {
  const inputClass =
    'w-full bg-canvas-subtle border border-border rounded px-2 py-1.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none transition-colors'

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-text-secondary">{field.label}</label>

      {field.control === 'text' && (
        <input
          type="text"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}

      {field.control === 'textarea' && (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      )}

      {field.control === 'color' && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={
              String(value ?? '#000000').startsWith('rgba')
                ? '#000000'
                : String(value ?? '#000000')
            }
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-10 rounded border border-border bg-canvas-subtle cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-canvas-subtle border border-border rounded px-2 py-1.5 text-xs text-text-primary font-mono focus:border-accent/50 focus:outline-none transition-colors"
          />
        </div>
      )}

      {field.control === 'slider' && (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={Number(value ?? 0)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 accent-accent"
          />
          <span className="text-xs text-text-muted w-8 text-right">{Number(value ?? 0)}</span>
        </div>
      )}

      {(field.control === 'select' || field.control === 'font') && (
        <select
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {field.control === 'toggle' && (
        <button
          onClick={() => onChange(!value)}
          className={`w-10 h-5 rounded-full transition-colors relative ${value ? 'bg-accent' : 'bg-canvas-raised border border-border'}`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
          />
        </button>
      )}

      {field.control === 'number' && (
        <input
          type="number"
          value={Number(value ?? 0)}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          onChange={(e) => onChange(Number(e.target.value))}
          className={inputClass}
        />
      )}
    </div>
  )
}
