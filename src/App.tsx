/**
 * Stack Intel — Main Application Shell
 * Evidence-first company intelligence workspace for WeMakeDevs × FalkorDB Graph Hacks.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from './api/client';
import {
  DataMode,
  HealthResponse,
  CompanyOverviewResponse,
  TechStackComponent,
  InvestigationItem,
  DecisionRecord,
  DecisionStatus,
  MemoryEvent,
  PlaybookItem,
  CompanySummaryItem,
  ApiError,
  SandboxAssessmentInput,
  SandboxAssessmentResult
} from './api/types';
import { Sidebar, NavSection } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { CustomSandboxModal } from './components/CustomSandboxModal';
import { OnboardingModal, OnboardingData } from './components/OnboardingModal';
import { HomePage } from './pages/HomePage';
import { OverviewPage } from './pages/OverviewPage';
import { StackHubPage } from './pages/StackHubPage';
import { InvestigationsPage } from './pages/InvestigationsPage';
import { DecisionsMemoryPage } from './pages/DecisionsMemoryPage';
import { generateCustomSandboxAssessment } from './utils/investigations';

export default function App() {
  const [mode, setMode] = useState<DataMode>(apiClient.getMode());
  const [currentSection, setCurrentSection] = useState<NavSection>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Structured onboarding modal state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Custom sandbox session state
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);
  const [customSandboxResult, setCustomSandboxResult] = useState<SandboxAssessmentResult | null>(null);

  // Default to RelayForge demo company as required by Part 2 & 3
  const [companies, setCompanies] = useState<CompanySummaryItem[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('relayforge');

  // Backend Health check state
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);

  // Overview state (Confirmed endpoint: GET /companies/{id}/overview)
  const [overview, setOverview] = useState<CompanyOverviewResponse | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<ApiError | null>(null);

  // Stack state (Unconfirmed in live mode)
  const [stackComponents, setStackComponents] = useState<TechStackComponent[]>([]);
  const [stackLoading, setStackLoading] = useState(false);
  const [stackError, setStackError] = useState<ApiError | null>(null);

  // Investigations state (Unconfirmed in live mode)
  const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);
  const [investigationsLoading, setInvestigationsLoading] = useState(false);
  const [investigationsError, setInvestigationsError] = useState<ApiError | null>(null);

  // Decisions state (Unconfirmed in live mode)
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [decisionsLoading, setDecisionsLoading] = useState(false);
  const [decisionsError, setDecisionsError] = useState<ApiError | null>(null);

  // Memory timeline state (Unconfirmed in live mode)
  const [memoryEvents, setMemoryEvents] = useState<MemoryEvent[]>([]);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [memoryError, setMemoryError] = useState<ApiError | null>(null);

  // Governance playbooks state (Unconfirmed in live mode)
  const [playbooks, setPlaybooks] = useState<PlaybookItem[]>([]);
  const [playbooksLoading, setPlaybooksLoading] = useState(false);
  const [playbooksError, setPlaybooksError] = useState<ApiError | null>(null);

  // Toggle Live vs Demo Mode
  const handleToggleMode = (newMode: DataMode) => {
    apiClient.setMode(newMode);
    setMode(newMode);
  };

  // Load backend health check
  const fetchHealth = useCallback(async () => {
    setHealthLoading(true);
    setHealthError(false);
    try {
      const res = await apiClient.getHealth();
      setHealth(res);
    } catch {
      setHealthError(true);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  // Load companies list
  const fetchCompanies = useCallback(async () => {
    try {
      const list = await apiClient.getCompanies();
      setCompanies(list);
      // Ensure selected company is valid
      if (list.length > 0 && !list.some((c) => c.id === selectedCompanyId)) {
        setSelectedCompanyId(list[0].id);
      }
    } catch {
      // fallback
    }
  }, [selectedCompanyId]);

  // Load Company Overview (Confirmed endpoint)
  const fetchOverview = useCallback(async (companyId: string) => {
    setOverviewLoading(true);
    setOverviewError(null);
    try {
      const data = await apiClient.getCompanyOverview(companyId);
      setOverview(data);
    } catch (err: unknown) {
      setOverviewError(err as ApiError);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  // Load StackHub data
  const fetchStack = useCallback(async (companyId: string) => {
    setStackLoading(true);
    setStackError(null);
    try {
      const list = await apiClient.getCompanyStack(companyId);
      setStackComponents(list);
    } catch (err: unknown) {
      setStackError(err as ApiError);
    } finally {
      setStackLoading(false);
    }
  }, []);

  // Load Investigations data
  const fetchInvestigations = useCallback(async (companyId: string) => {
    setInvestigationsLoading(true);
    setInvestigationsError(null);
    try {
      const list = await apiClient.getCompanyInvestigations(companyId);
      setInvestigations(list);
    } catch (err: unknown) {
      setInvestigationsError(err as ApiError);
    } finally {
      setInvestigationsLoading(false);
    }
  }, []);

  // Load Decisions & Memory data
  const fetchDecisions = useCallback(async (companyId: string) => {
    setDecisionsLoading(true);
    setDecisionsError(null);
    try {
      const list = await apiClient.getCompanyDecisions(companyId);
      setDecisions(list);
    } catch (err: unknown) {
      setDecisionsError(err as ApiError);
    } finally {
      setDecisionsLoading(false);
    }
  }, []);

  // Load Memory timeline
  const fetchMemory = useCallback(async (companyId: string) => {
    setMemoryLoading(true);
    setMemoryError(null);
    try {
      const list = await apiClient.getCompanyMemory(companyId);
      setMemoryEvents(list);
    } catch (err: unknown) {
      setMemoryError(err as ApiError);
    } finally {
      setMemoryLoading(false);
    }
  }, []);

  // Load Governance Playbooks
  const fetchPlaybooks = useCallback(async (companyId: string) => {
    setPlaybooksLoading(true);
    setPlaybooksError(null);
    try {
      const list = await apiClient.getCompanyPlaybooks(companyId);
      setPlaybooks(list);
    } catch (err: unknown) {
      setPlaybooksError(err as ApiError);
    } finally {
      setPlaybooksLoading(false);
    }
  }, []);

  // Initial and mode switch loads
  useEffect(() => {
    fetchHealth();
    fetchCompanies();
  }, [mode, fetchHealth, fetchCompanies]);

  // Company change or section change loads
  useEffect(() => {
    if (!selectedCompanyId) return;

    fetchOverview(selectedCompanyId);

    if (currentSection === 'stackhub') {
      fetchStack(selectedCompanyId);
    } else if (currentSection === 'investigations') {
      fetchInvestigations(selectedCompanyId);
    } else if (currentSection === 'decisions') {
      fetchDecisions(selectedCompanyId);
      fetchMemory(selectedCompanyId);
      fetchPlaybooks(selectedCompanyId);
    }
  }, [selectedCompanyId, currentSection, mode, fetchOverview, fetchStack, fetchInvestigations, fetchDecisions, fetchMemory, fetchPlaybooks]);

  // Simulated decision status transition (Demo Mode only)
  const handleUpdateDecisionStatus = (
    decisionId: string,
    newStatus: DecisionStatus,
    note: string
  ) => {
    setDecisions((prev) =>
      prev.map((d) => {
        if (d.id !== decisionId) return d;
        return {
          ...d,
          status: newStatus,
          isLocallySimulated: true,
          simulatedActionNote: note
        };
      })
    );
  };

  // Reset decisions to initial fixture state
  const handleResetDecisions = () => {
    if (selectedCompanyId) {
      fetchDecisions(selectedCompanyId);
    }
  };

  const activeCompanyName = customSandboxResult
    ? `${customSandboxResult.companyName} (Sandbox)`
    : companies.find((c) => c.id === selectedCompanyId)?.name ||
      overview?.name ||
      selectedCompanyId;

  const handleNavigateToInvestigations = (toolId?: string) => {
    setCurrentSection('investigations');
    if (toolId) {
      setSearchQuery(toolId.replace(/^tool-/, ''));
    } else {
      setSearchQuery('');
    }
  };

  const handleCustomSandboxSubmit = (input: SandboxAssessmentInput) => {
    const result = generateCustomSandboxAssessment(input);
    setCustomSandboxResult(result);
    setIsSandboxModalOpen(false);
    setCurrentSection('investigations');
    setSearchQuery('');
  };

  const handleOnboardingSubmit = (data: OnboardingData) => {
    const input: SandboxAssessmentInput = {
      companyName: data.companyName,
      description: data.description || `${data.industry} company (${data.stage})`,
      stage: data.stage,
      currency: 'USD',
      goals: data.objectives,
      tools: data.tools.map((t) => ({
        name: t.name,
        monthlyCost: t.monthlyCost || 0
      })),
      constraints: [
        ...(data.requireHumanApproval ? ['Production changes require human approval'] : []),
        ...(data.preserveMonitoring ? ['Preserve error monitoring & incident visibility'] : []),
        ...(data.avoidDowntime ? ['Zero tolerable scheduled downtime'] : []),
        ...(data.preserveCurrentDatabase ? ['Do not migrate primary database'] : []),
        ...data.customConstraints
      ]
    };

    const result = generateCustomSandboxAssessment(input);
    setCustomSandboxResult(result);
    setIsOnboardingOpen(false);
    setCurrentSection('investigations');
    setSearchQuery('');
  };

  const handleUpdateInvestigationEvidence = (
    investigationId: string,
    reqId: string,
    url: string,
    note: string
  ) => {
    // If in custom sandbox
    if (customSandboxResult) {
      const updatedInvs = customSandboxResult.investigations.map((inv) => {
        if (inv.id !== investigationId || !inv.requirements) return inv;
        return {
          ...inv,
          requirements: inv.requirements.map((r) => {
            if (r.id !== reqId) return r;
            return {
              ...r,
              evidenceOrigin: 'user_provided' as const,
              userSubmittedEvidence: {
                url,
                note,
                submittedAt: new Date().toISOString()
              }
            };
          })
        };
      });

      setCustomSandboxResult({
        ...customSandboxResult,
        investigations: updatedInvs
      });
      return;
    }

    // Otherwise update standard investigations list
    setInvestigations((prev) =>
      prev.map((inv) => {
        if (inv.id !== investigationId || !inv.requirements) return inv;
        return {
          ...inv,
          requirements: inv.requirements.map((r) => {
            if (r.id !== reqId) return r;
            return {
              ...r,
              evidenceOrigin: 'user_provided' as const,
              userSubmittedEvidence: {
                url,
                note,
                submittedAt: new Date().toISOString()
              }
            };
          })
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="flex-1 flex min-w-0">
        {/* Desktop Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={(sec) => {
            setCurrentSection(sec);
            setSearchQuery('');
          }}
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          onSelectCompany={(id) => {
            setCustomSandboxResult(null); // Clear custom sandbox when explicitly picking an entity
            setSelectedCompanyId(id);
            setSearchQuery('');
          }}
          health={health}
          healthLoading={healthLoading}
          healthError={healthError}
          mode={mode}
          onToggleMode={handleToggleMode}
          onStartOnboarding={() => setIsOnboardingOpen(true)}
        />

        {/* Mobile Slideout Nav */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          currentSection={currentSection}
          onSelectSection={(sec) => {
            setCurrentSection(sec);
            setSearchQuery('');
          }}
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          onSelectCompany={(id) => {
            setCustomSandboxResult(null);
            setSelectedCompanyId(id);
            setSearchQuery('');
          }}
          mode={mode}
          onToggleMode={handleToggleMode}
          health={health}
          onStartOnboarding={() => setIsOnboardingOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            currentSection={currentSection}
            companyName={activeCompanyName}
            companyId={selectedCompanyId}
            mode={mode}
            onToggleMode={handleToggleMode}
            health={health}
            onOpenMobileNav={() => setIsMobileNavOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentSection === 'home' && (
              <HomePage
                mode={mode}
                health={health}
                onStartOnboarding={() => setIsOnboardingOpen(true)}
                onExploreDemo={() => {
                  setSelectedCompanyId('relayforge');
                  setCurrentSection('overview');
                }}
                onNavigateToWorkspace={(sec) => setCurrentSection(sec)}
              />
            )}

            {currentSection === 'overview' && (
              <OverviewPage
                data={overview}
                loading={overviewLoading}
                error={overviewError}
                onRetry={() => fetchOverview(selectedCompanyId)}
                mode={mode}
                health={health}
                onNavigateToStack={() => setCurrentSection('stackhub')}
                onNavigateToInvestigations={handleNavigateToInvestigations}
              />
            )}

            {currentSection === 'stackhub' && (
              <StackHubPage
                tools={overview?.tools || []}
                goals={overview?.goals || []}
                loading={overviewLoading || stackLoading}
                error={stackError}
                onRetry={() => {
                  fetchOverview(selectedCompanyId);
                  fetchStack(selectedCompanyId);
                }}
                mode={mode}
                searchQuery={searchQuery}
                onLaunchInvestigation={handleNavigateToInvestigations}
              />
            )}

            {currentSection === 'investigations' && (
              <InvestigationsPage
                investigations={investigations}
                loading={investigationsLoading}
                error={investigationsError}
                onRetry={() => fetchInvestigations(selectedCompanyId)}
                mode={mode}
                searchQuery={searchQuery}
                companyId={selectedCompanyId}
                onOpenSandboxModal={() => setIsSandboxModalOpen(true)}
                customSandboxResult={customSandboxResult}
                onClearCustomSandbox={() => setCustomSandboxResult(null)}
                onUpdateInvestigationEvidence={handleUpdateInvestigationEvidence}
              />
            )}

            {currentSection === 'decisions' && (
              <DecisionsMemoryPage
                decisions={decisions}
                loading={decisionsLoading}
                error={decisionsError}
                onRetry={() => {
                  fetchDecisions(selectedCompanyId);
                  fetchMemory(selectedCompanyId);
                  fetchPlaybooks(selectedCompanyId);
                }}
                mode={mode}
                searchQuery={searchQuery}
                memoryEvents={memoryEvents}
                memoryLoading={memoryLoading}
                memoryError={memoryError}
                playbooks={playbooks}
                playbooksLoading={playbooksLoading}
                playbooksError={playbooksError}
                onUpdateDecisionStatus={handleUpdateDecisionStatus}
                onResetDecisions={handleResetDecisions}
              />
            )}
          </main>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSubmit={handleOnboardingSubmit}
        mode={mode}
      />

      {/* Custom Sandbox Assessment Modal */}
      <CustomSandboxModal
        isOpen={isSandboxModalOpen}
        onClose={() => setIsSandboxModalOpen(false)}
        onSubmit={handleCustomSandboxSubmit}
        mode={mode}
      />
    </div>
  );
}
