import React from 'react';
import { parseRichText } from './RichTextParser';

// ─── Shared section renderer (React) ──────────────────────────────────────────
const Section = ({ title, content, accentColor, small }) => (
    <div style={{ marginBottom: small ? '14px' : '20px' }}>
        <div style={{
            fontSize: '9px',
            fontWeight: 900,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: '7px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        }}>
            <span style={{
                display: 'inline-block',
                width: '18px',
                height: '2px',
                background: accentColor,
                borderRadius: '2px',
                flexShrink: 0
            }} />
            {title}
        </div>
        <div
            style={{ fontSize: '11px', lineHeight: '1.65', color: '#374151' }}
            dangerouslySetInnerHTML={{ __html: parseRichText(content) }}
        />
    </div>
);

// ─── TEMPLATE 1: EXECUTIVE ─────────────────────────────────────────────────────
// Dark sidebar left, clean content right — standard for senior roles
export const TemplateExecutive = ({ data, photo, styles }) => (
    <div style={{ display: 'flex', height: '100%', fontFamily: styles.fontFamily, background: '#fff' }}>
        {/* Sidebar */}
        <div style={{
            width: '240px',
            background: styles.sidebarColor || '#0F172A',
            color: '#fff',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
        }}>
            {photo && (
                <img src={photo} style={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '28px',
                    border: '2px solid rgba(255,255,255,0.1)'
                }} />
            )}
            {!photo && (
                <div style={{
                    width: '100%',
                    paddingBottom: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    marginBottom: '28px',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px', fontWeight: 900, color: 'rgba(255,255,255,0.15)'
                    }}>
                        {data.name?.[0] || 'Y'}
                    </div>
                </div>
            )}

            <SidebarSection title="Contact" accentColor={styles.accentColor}>
                <SidebarItem label="Email" value={data.email} />
                {data.phone && <SidebarItem label="Phone" value={data.phone} />}
                {data.linkedin && <SidebarItem label="LinkedIn" value={data.linkedin} />}
                {data.website && <SidebarItem label="Portfolio" value={data.website} />}
                {data.location && <SidebarItem label="Location" value={data.location} />}
            </SidebarSection>

            <SidebarSection title="Skills" accentColor={styles.accentColor}>
                <div style={{ fontSize: '10px', lineHeight: '1.7', color: 'rgba(255,255,255,0.75)' }}
                    dangerouslySetInnerHTML={{ __html: parseRichText(data.skills) }} />
            </SidebarSection>

            {data.languages && (
                <SidebarSection title="Languages" accentColor={styles.accentColor}>
                    <div style={{ fontSize: '10px', lineHeight: '1.7', color: 'rgba(255,255,255,0.75)' }}
                        dangerouslySetInnerHTML={{ __html: parseRichText(data.languages) }} />
                </SidebarSection>
            )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '40px 36px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px', borderBottom: `3px solid ${styles.accentColor}`, paddingBottom: '20px' }}>
                <h1 style={{
                    fontSize: '34px',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    color: '#0F172A',
                    margin: '0 0 4px 0',
                    lineHeight: 1.1
                }}>{data.name}</h1>
                <p style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: styles.accentColor,
                    margin: 0
                }}>{data.role}</p>
                {data.summary && (
                    <p style={{
                        fontSize: '11px',
                        color: '#64748b',
                        marginTop: '10px',
                        lineHeight: '1.6',
                        margin: '10px 0 0 0'
                    }}>{data.summary}</p>
                )}
            </div>

            <Section title="Experience" content={data.experience} accentColor={styles.accentColor} />
            <Section title="Education" content={data.education} accentColor={styles.accentColor} />
            {data.projects && <Section title="Projects" content={data.projects} accentColor={styles.accentColor} />}
            {data.certifications && <Section title="Certifications" content={data.certifications} accentColor={styles.accentColor} small />}
        </div>
    </div>
);

const SidebarSection = ({ title, accentColor, children }) => (
    <div style={{ marginBottom: '24px' }}>
        <div style={{
            fontSize: '8px',
            fontWeight: 900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: '10px',
            paddingBottom: '6px',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>{title}</div>
        {children}
    </div>
);

const SidebarItem = ({ label, value }) => value ? (
    <div style={{ marginBottom: '6px' }}>
        <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all', lineHeight: 1.4 }}>{value}</div>
    </div>
) : null;


// ─── TEMPLATE 2: ATS CLEAN ─────────────────────────────────────────────────────
// Single-column, recruiter-friendly, zero clutter — max ATS score
export const TemplateATS = ({ data, photo, styles }) => (
    <div style={{ fontFamily: styles.fontFamily, padding: '48px 52px', background: '#fff', height: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
                <h1 style={{
                    fontSize: '36px', fontWeight: 900, letterSpacing: '-0.02em',
                    color: '#111827', margin: '0 0 5px 0', lineHeight: 1.1
                }}>{data.name}</h1>
                <p style={{
                    fontSize: '13px', fontWeight: 700, color: styles.accentColor,
                    textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px 0'
                }}>{data.role}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>
                    {data.email && <span>✉ {data.email}</span>}
                    {data.phone && <span>📱 {data.phone}</span>}
                    {data.linkedin && <span>🔗 {data.linkedin}</span>}
                    {data.location && <span>📍 {data.location}</span>}
                    {data.website && <span>🌐 {data.website}</span>}
                </div>
            </div>
            {photo && (
                <img src={photo} style={{
                    width: '80px', height: '80px', borderRadius: '8px',
                    objectFit: 'cover', marginLeft: '20px',
                    border: `2px solid ${styles.accentColor}20`
                }} />
            )}
        </div>

        <div style={{ height: '2px', background: styles.accentColor, marginBottom: '22px', borderRadius: '2px' }} />

        {data.summary && (
            <ATSSection title="Summary" accentColor={styles.accentColor}>
                <p style={{ fontSize: '11px', lineHeight: '1.65', color: '#374151', margin: 0 }}>{data.summary}</p>
            </ATSSection>
        )}

        <ATSSection title="Experience" accentColor={styles.accentColor}>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#374151' }}
                dangerouslySetInnerHTML={{ __html: parseRichText(data.experience) }} />
        </ATSSection>

        <ATSSection title="Education" accentColor={styles.accentColor}>
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#374151' }}
                dangerouslySetInnerHTML={{ __html: parseRichText(data.education) }} />
        </ATSSection>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
            <ATSSection title="Skills" accentColor={styles.accentColor}>
                <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#374151' }}
                    dangerouslySetInnerHTML={{ __html: parseRichText(data.skills) }} />
            </ATSSection>
            {data.projects && (
                <ATSSection title="Projects" accentColor={styles.accentColor}>
                    <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#374151' }}
                        dangerouslySetInnerHTML={{ __html: parseRichText(data.projects) }} />
                </ATSSection>
            )}
        </div>

        {data.certifications && (
            <ATSSection title="Certifications" accentColor={styles.accentColor}>
                <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#374151' }}
                    dangerouslySetInnerHTML={{ __html: parseRichText(data.certifications) }} />
            </ATSSection>
        )}
        {data.languages && (
            <ATSSection title="Languages" accentColor={styles.accentColor}>
                <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#374151' }}
                    dangerouslySetInnerHTML={{ __html: parseRichText(data.languages) }} />
            </ATSSection>
        )}
    </div>
);

const ATSSection = ({ title, accentColor, children }) => (
    <div style={{ marginBottom: '18px' }}>
        <div style={{
            fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: accentColor,
            marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
            {title}
            <div style={{ flex: 1, height: '1px', background: `${accentColor}30` }} />
        </div>
        {children}
    </div>
);


// ─── TEMPLATE 3: CREATIVE ─────────────────────────────────────────────────────
// Bold accent header band, two-column body — for design/product/creative roles
export const TemplateCreative = ({ data, photo, styles }) => (
    <div style={{ fontFamily: styles.fontFamily, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Bold header band */}
        <div style={{
            background: styles.accentColor,
            padding: '36px 44px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
        }}>
            <div>
                <p style={{
                    fontSize: '10px', fontWeight: 900, letterSpacing: '0.25em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
                    margin: '0 0 6px 0'
                }}>Curriculum Vitae</p>
                <h1 style={{
                    fontSize: '38px', fontWeight: 900, letterSpacing: '-0.03em',
                    color: '#fff', margin: '0 0 6px 0', lineHeight: 1.0
                }}>{data.name}</h1>
                <p style={{
                    fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)',
                    letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase'
                }}>{data.role}</p>
            </div>
            {photo ? (
                <img src={photo} style={{
                    width: '90px', height: '90px', borderRadius: '50%',
                    objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)'
                }} />
            ) : (
                <div style={{
                    width: '90px', height: '90px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    border: '3px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', fontWeight: 900, color: 'rgba(255,255,255,0.5)'
                }}>
                    {data.name?.[0] || 'Y'}
                </div>
            )}
        </div>

        {/* Contact strip */}
        <div style={{
            background: '#0F172A',
            padding: '10px 44px',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap'
        }}>
            {[data.email, data.phone, data.linkedin, data.location, data.website].filter(Boolean).map((item, i) => (
                <span key={i} style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{item}</span>
            ))}
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', flex: 1, overflow: 'hidden' }}>
            {/* Left: main */}
            <div style={{ padding: '28px 32px 28px 44px', borderRight: '1px solid #f1f5f9' }}>
                {data.summary && (
                    <div style={{ marginBottom: '20px' }}>
                        <CreativeSectionTitle title="Profile" accentColor={styles.accentColor} />
                        <p style={{ fontSize: '11px', lineHeight: '1.65', color: '#374151', margin: 0 }}>{data.summary}</p>
                    </div>
                )}
                <div style={{ marginBottom: '20px' }}>
                    <CreativeSectionTitle title="Experience" accentColor={styles.accentColor} />
                    <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#374151' }}
                        dangerouslySetInnerHTML={{ __html: parseRichText(data.experience) }} />
                </div>
                {data.projects && (
                    <div style={{ marginBottom: '20px' }}>
                        <CreativeSectionTitle title="Projects" accentColor={styles.accentColor} />
                        <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#374151' }}
                            dangerouslySetInnerHTML={{ __html: parseRichText(data.projects) }} />
                    </div>
                )}
            </div>

            {/* Right: sidebar */}
            <div style={{ padding: '28px 32px 28px 28px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <CreativeSectionTitle title="Education" accentColor={styles.accentColor} />
                    <div style={{ fontSize: '10px', lineHeight: '1.7', color: '#374151' }}
                        dangerouslySetInnerHTML={{ __html: parseRichText(data.education) }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <CreativeSectionTitle title="Skills" accentColor={styles.accentColor} />
                    <div style={{ fontSize: '10px', lineHeight: '1.7', color: '#374151' }}
                        dangerouslySetInnerHTML={{ __html: parseRichText(data.skills) }} />
                </div>
                {data.certifications && (
                    <div style={{ marginBottom: '20px' }}>
                        <CreativeSectionTitle title="Certifications" accentColor={styles.accentColor} />
                        <div style={{ fontSize: '10px', lineHeight: '1.7', color: '#374151' }}
                            dangerouslySetInnerHTML={{ __html: parseRichText(data.certifications) }} />
                    </div>
                )}
                {data.languages && (
                    <div>
                        <CreativeSectionTitle title="Languages" accentColor={styles.accentColor} />
                        <div style={{ fontSize: '10px', lineHeight: '1.7', color: '#374151' }}
                            dangerouslySetInnerHTML={{ __html: parseRichText(data.languages) }} />
                    </div>
                )}
            </div>
        </div>
    </div>
);

const CreativeSectionTitle = ({ title, accentColor }) => (
    <div style={{
        fontSize: '9px', fontWeight: 900, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: accentColor,
        marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'
    }}>
        <div style={{ width: '20px', height: '2px', background: accentColor, borderRadius: '1px', flexShrink: 0 }} />
        {title}
    </div>
);