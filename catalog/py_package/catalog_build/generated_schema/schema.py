from __future__ import annotations

import re
import sys
from datetime import (
    date,
    datetime,
    time
)
from decimal import Decimal
from enum import Enum
from typing import (
    Any,
    ClassVar,
    Literal,
    Optional,
    Union
)

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    RootModel,
    SerializationInfo,
    SerializerFunctionWrapHandler,
    field_validator,
    model_serializer
)


metamodel_version = "1.12.0"
version = "None"


class ConfiguredBaseModel(BaseModel):
    model_config = ConfigDict(
        serialize_by_alias = True,
        validate_by_name = True,
        validate_assignment = True,
        validate_default = True,
        extra = "forbid",
        arbitrary_types_allowed = True,
        use_enum_values = True,
        strict = False,
    )





class LinkMLMeta(RootModel):
    root: dict[str, Any] = {}
    model_config = ConfigDict(frozen=True)

    def __getattr__(self, key:str):
        return getattr(self.root, key)

    def __getitem__(self, key:str):
        return self.root[key]

    def __setitem__(self, key:str, value):
        self.root[key] = value

    def __contains__(self, key:str) -> bool:
        return key in self.root


linkml_meta = LinkMLMeta({'default_prefix': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/schema.yaml#',
     'description': 'Combined source data schemas.',
     'id': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/schema.yaml#',
     'imports': ['./assemblies',
                 './organisms',
                 './outbreaks',
                 './pangenomes',
                 './precomputed_results',
                 './taxa',
                 './workflow_categories',
                 './workflows'],
     'name': 'schema',
     'prefixes': {'linkml': {'prefix_prefix': 'linkml',
                             'prefix_reference': 'https://w3id.org/linkml/'}},
     'source_file': 'catalog/py_package/catalog_build/schema/schema.yaml'} )

class OrganismPloidy(str, Enum):
    """
    Possible ploidies of an organism.
    """
    DIPLOID = "DIPLOID"
    HAPLOID = "HAPLOID"
    POLYPLOID = "POLYPLOID"


class LibraryLayout(str, Enum):
    """
    Enumeration of possible library layouts for sequencing data.
    """
    PAIRED = "PAIRED"
    """
    Paired-end sequencing reads
    """
    SINGLE = "SINGLE"
    """
    Single-end sequencing reads
    """


class LibrarySource(str, Enum):
    """
    Enumeration of possible library sources for sequencing data.
    """
    GENOMIC = "GENOMIC"
    """
    Genomic DNA (includes PCR products from genomic DNA)
    """
    GENOMIC_SINGLE_CELL = "GENOMIC SINGLE CELL"
    """
    Genomic DNA from a single cell
    """
    TRANSCRIPTOMIC = "TRANSCRIPTOMIC"
    """
    Transcription products or non-genomic DNA (EST, cDNA, RT-PCR, screened libraries)
    """
    TRANSCRIPTOMIC_SINGLE_CELL = "TRANSCRIPTOMIC SINGLE CELL"
    """
    Transcription products from a single cell
    """
    METAGENOMIC = "METAGENOMIC"
    """
    Mixed material from metagenome
    """
    METATRANSCRIPTOMIC = "METATRANSCRIPTOMIC"
    """
    Transcription products from community targets
    """
    SYNTHETIC = "SYNTHETIC"
    """
    Synthetic DNA
    """
    VIRAL_RNA = "VIRAL RNA"
    """
    Viral RNA
    """
    OTHER = "OTHER"
    """
    Other, unspecified, or unknown library source material
    """


class LibraryStrategy(str, Enum):
    """
    Enumeration of possible library strategies for sequencing data.
    """
    WGS = "WGS"
    """
    Whole genome sequencing
    """
    WGA = "WGA"
    """
    Whole genome amplification
    """
    WXS = "WXS"
    """
    Whole exome sequencing
    """
    RNA_Seq = "RNA-Seq"
    """
    RNA sequencing
    """
    snRNA_seq = "snRNA-seq"
    """
    Small nuclear RNA sequencing
    """
    ssRNA_seq = "ssRNA-seq"
    """
    Single-stranded RNA sequencing
    """
    miRNA_Seq = "miRNA-Seq"
    """
    microRNA sequencing
    """
    ncRNA_Seq = "ncRNA-Seq"
    """
    Non-coding RNA sequencing
    """
    FL_cDNA = "FL-cDNA"
    """
    Full-length cDNA sequencing
    """
    EST = "EST"
    """
    Expressed sequence tag
    """
    Hi_C = "Hi-C"
    """
    Chromosome conformation capture
    """
    ATAC_seq = "ATAC-seq"
    """
    Assay for transposase-accessible chromatin sequencing
    """
    WCS = "WCS"
    """
    Whole chromosome sequencing
    """
    RAD_Seq = "RAD-Seq"
    """
    Restriction site associated DNA sequencing
    """
    CLONE = "CLONE"
    """
    Clone sequencing
    """
    POOLCLONE = "POOLCLONE"
    """
    Pooled clone sequencing
    """
    AMPLICON = "AMPLICON"
    """
    Amplicon sequencing
    """
    CLONEEND = "CLONEEND"
    """
    Clone end sequencing
    """
    FINISHING = "FINISHING"
    """
    Sequencing intended to close gaps in a genome assembly
    """
    ChIP_Seq = "ChIP-Seq"
    """
    Chromatin immunoprecipitation sequencing
    """
    MNase_Seq = "MNase-Seq"
    """
    Micrococcal nuclease sequencing
    """
    Ribo_Seq = "Ribo-Seq"
    """
    Ribosome profiling
    """
    DNase_Hypersensitivity = "DNase-Hypersensitivity"
    """
    DNase hypersensitivity sequencing
    """
    Bisulfite_Seq = "Bisulfite-Seq"
    """
    Bisulfite sequencing
    """
    CTS = "CTS"
    """
    Concatenated tag sequencing
    """
    ChM_Seq = "ChM-Seq"
    """
    ChIPmentation combines chromatin immunoprecipitation with sequencing library preparation by Tn5 transposase
    """
    GBS = "GBS"
    """
    Genotyping by sequencing
    """
    MRE_Seq = "MRE-Seq"
    """
    Methylation-sensitive restriction enzyme sequencing
    """
    MeDIP_Seq = "MeDIP-Seq"
    """
    Methylated DNA immunoprecipitation sequencing
    """
    MBD_Seq = "MBD-Seq"
    """
    Methyl-CpG binding domain sequencing
    """
    NOMe_Seq = "NOMe-Seq"
    """
    Nucleosome occupancy and methylome sequencing
    """
    Tn_Seq = "Tn-Seq"
    """
    Quantitatively determine fitness of bacterial genes based on how many times a purposely seeded transposon gets inserted into each gene of a colony after some time.
    """
    VALIDATION = "VALIDATION"
    """
    Independent experiment to re-evaluate putative variants
    """
    FAIRE_seq = "FAIRE-seq"
    """
    Formaldehyde-assisted isolation of regulatory elements sequencing
    """
    SELEX = "SELEX"
    """
    Systematic evolution of ligands by exponential enrichment sequencing
    """
    RIP_Seq = "RIP-Seq"
    """
    RNA immunoprecipitation sequencing
    """
    ChIA_PET = "ChIA-PET"
    """
    Direct sequencing of proximity-ligated chromatin immunoprecipitates
    """
    Synthetic_Long_Read = "Synthetic-Long-Read"
    """
    Binning and barcoding of large DNA fragments to facilitate assembly of the fragment
    """
    Targeted_Capture = "Targeted-Capture"
    """
    Enrichment of a targeted subset of loci
    """
    Tethered_Chromatin_Conformation_Capture = "Tethered Chromatin Conformation Capture"
    """
    Tethered chromosome conformation capture
    """
    OTHER = "OTHER"
    """
    Other, unspecified, or unknown library strategy
    """


class OutbreakPriority(str, Enum):
    """
    Possible priorities of an outbreak.
    """
    HIGHEST = "HIGHEST"
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MODERATE_HIGH = "MODERATE_HIGH"
    MODERATE = "MODERATE"


class OutbreakResourceType(str, Enum):
    """
    Possible types of an outbreak resource.
    """
    PUBLICATION = "PUBLICATION"
    REFERENCE = "REFERENCE"
    NEWS = "NEWS"
    WORKFLOW = "WORKFLOW"
    DATA = "DATA"
    OTHER = "OTHER"
    HGPHYLOPLACE = "HGPHYLOPLACE"


class CompendiumMatch(str, Enum):
    """
    The degree to which a precomputed sequence result matches an entry in the reference compendium.
    """
    EXACT = "EXACT"
    """
    The sequence matches a compendium entry exactly.
    """
    PARTIAL = "PARTIAL"
    """
    The sequence partially matches a compendium entry.
    """
    NOVEL = "NOVEL"
    """
    The sequence does not match any compendium entry and is considered novel.
    """
    UNRESOLVED = "UNRESOLVED"
    """
    A compendium match could not be determined for the sequence.
    """


class WorkflowCategoryId(str, Enum):
    """
    Set of IDs of workflow categories.
    """
    VARIANT_CALLING = "VARIANT_CALLING"
    TRANSCRIPTOMICS = "TRANSCRIPTOMICS"
    REGULATION = "REGULATION"
    ASSEMBLY = "ASSEMBLY"
    GENOME_COMPARISONS = "GENOME_COMPARISONS"
    PROTEIN_FOLDING = "PROTEIN_FOLDING"
    CONSENSUS_SEQUENCES = "CONSENSUS_SEQUENCES"
    ANNOTATION = "ANNOTATION"
    COMPARATIVE_GENOMICS = "COMPARATIVE_GENOMICS"
    OTHER = "OTHER"


class CollectionType(str, Enum):
    """
    Galaxy collection types supported for collection_spec in workflow parameters.
Currently only 'list' collections are supported, which represent a simple ordered list of datasets.
    """
    list = "list"
    """
    A simple ordered list of datasets. Each element in the collection is a separate dataset.
    """


class WorkflowParameterVariable(str, Enum):
    """
    Possible variables that can be inserted into workflow parameters.
    """
    ASSEMBLY_ID = "ASSEMBLY_ID"
    ASSEMBLY_FASTA_URL = "ASSEMBLY_FASTA_URL"
    FASTA_COLLECTION = "FASTA_COLLECTION"
    GENE_MODEL_URL = "GENE_MODEL_URL"
    SANGER_READ_RUN_FORWARD_FILE = "SANGER_READ_RUN_FORWARD_FILE"
    SANGER_READ_RUN_PAIRED = "SANGER_READ_RUN_PAIRED"
    SANGER_READ_RUN_REVERSE_FILE = "SANGER_READ_RUN_REVERSE_FILE"
    SANGER_READ_RUN_SINGLE = "SANGER_READ_RUN_SINGLE"
    SANGER_READ_RUN_SINGLE_FILE = "SANGER_READ_RUN_SINGLE_FILE"


class WorkflowPloidy(str, Enum):
    """
    Possible ploidies supported by workflows.
    """
    ANY = "ANY"
    DIPLOID = "DIPLOID"
    HAPLOID = "HAPLOID"
    POLYPLOID = "POLYPLOID"


class WorkflowScope(str, Enum):
    """
    The scope level at which a workflow operates, determining its display context and required inputs.
    """
    ASSEMBLY = "ASSEMBLY"
    """
    Workflow operates on a specific genome assembly and requires assembly selection as the first step.
    """
    ORGANISM = "ORGANISM"
    """
    Workflow operates at the organism level, either requiring no specific assembly or working across multiple assemblies.
    """
    SEQUENCE = "SEQUENCE"
    """
    Workflow operates on a user-provided sequence (e.g., single gene) rather than a full genome assembly.
    """



class Assemblies(ConfiguredBaseModel):
    """
    Root object containing a collection of genomic assembly definitions for the BRC Analytics platform.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/assemblies.yaml#',
         'tree_root': True})

    assemblies: list[Assembly] = Field(default=..., description="""Collection of genomic assembly entries that will be available for analysis in the BRC Analytics platform.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Assemblies']} })


class Assembly(ConfiguredBaseModel):
    """
    Definition of a genomic assembly with its unique identifier.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/assemblies.yaml#'})

    accession: str = Field(default=..., description="""The unique accession identifier for the assembly (e.g., GCA_000001405.28 for GRCh38), used to retrieve the assembly data from public repositories.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Assembly']} })


class Organisms(ConfiguredBaseModel):
    """
    Root object containing a collection of organism definitions for the BRC Analytics platform.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/organisms.yaml#',
         'tree_root': True})

    organisms: list[Organism] = Field(default=..., description="""Collection of organism entries that will be available in the BRC Analytics platform.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Organisms']} })


class Organism(ConfiguredBaseModel):
    """
    Definition of an organism with its taxonomic and genetic characteristics.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/organisms.yaml#'})

    taxonomy_id: int = Field(default=..., description="""An NCBI Taxonomy ID at rank 'species'.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Organism',
                       'Outbreak',
                       'PrecomputedDiscovery',
                       'Taxon',
                       'Workflow']} })
    ploidy: list[OrganismPloidy] = Field(default=..., description="""The possible ploidy states (number of chromosome sets) that the organism may have, which determines compatible workflows.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Organism', 'Workflow']} })


class Outbreaks(ConfiguredBaseModel):
    """
    Root object containing a collection of pathogen definitions for the BRC Analytics platform to highlight as outbreaks/priority pathogens.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/outbreaks.yaml#',
         'tree_root': True})

    outbreaks: list[Outbreak] = Field(default=..., description="""Collection of pathogen entries that will be displayed in the BRC Analytics platform as outbreaks/priority pathogens.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreaks']} })


class Outbreak(ConfiguredBaseModel):
    """
    Definition of a priority pathogen with its taxonomic classification, priority level, and associated resources.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/outbreaks.yaml#'})

    name: str = Field(default=..., description="""The display name of the pathogen as it will appear in the BRC Analytics interface.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak', 'WorkflowCategory', 'WorkflowCollectionSpec']} })
    taxonomy_id: int = Field(default=..., description="""The NCBI Taxonomy ID for the pathogen. Used to link to relevant genomic data and workflows.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Organism',
                       'Outbreak',
                       'PrecomputedDiscovery',
                       'Taxon',
                       'Workflow']} })
    priority: OutbreakPriority = Field(default=..., description="""The priority level of the pathogen, which determines its visibility and prominence in the BRC Analytics interface.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak']} })
    resources: list[OutbreakResource] = Field(default=..., description="""Collection of external resources (references, tools, databases) related to the pathogen.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak']} })
    description: MarkdownFileReference = Field(default=..., description="""Reference to a markdown file containing detailed information about the pathogen.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak', 'WorkflowCategory', 'WorkflowDataRequirements']} })
    active: bool = Field(default=..., description="""Boolean flag that determines if the pathogen should be included in the BRC Analytics interface. Used to manage visibility as pathogen relevance changes over time.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak', 'Workflow']} })
    highlight_descendant_taxonomy_ids: Optional[list[int]] = Field(default=None, description="""List of NCBI Taxonomy IDs for descendant taxa (e.g., specific strains or serotypes) that should be highlighted within the outbreak category.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak']} })
    precomputed: Optional[PrecomputedResults] = Field(default=None, description="""Optional pre-computed workflow results for this pathogen, including how to discover eligible runs and where the published results are.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak']} })


class PrecomputedResults(ConfiguredBaseModel):
    """
    Pre-computed results of a workflow run on public data for a pathogen.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/outbreaks.yaml#'})

    workflow_trs_id: str = Field(default=..., description="""The TRS ID of the workflow (including version) used to compute the results.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResults', 'WorkflowProvenance']} })
    discovery: Optional[PrecomputedDiscovery] = Field(default=None, description="""Criteria for discovering public sequencing runs to process. If omitted, runs are not discovered automatically.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResults']} })
    release: Optional[PrecomputedRelease] = Field(default=None, description="""Details of the latest published results. If omitted, no results are shown.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResults']} })


class PrecomputedDiscovery(ConfiguredBaseModel):
    """
    Criteria for discovering public sequencing runs to process with a workflow.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/outbreaks.yaml#'})

    taxonomy_id: Optional[int] = Field(default=None, description="""The NCBI Taxonomy ID to discover runs for, if different from the taxonomy ID of the pathogen.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Organism',
                       'Outbreak',
                       'PrecomputedDiscovery',
                       'Taxon',
                       'Workflow']} })
    library_layout: Optional[LibraryLayout] = Field(default=None, description="""The library layout that discovered runs must have.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedDiscovery', 'WorkflowDataRequirements']} })
    library_strategy: Optional[list[LibraryStrategy]] = Field(default=None, description="""The library strategy values that discovered runs may have.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedDiscovery', 'WorkflowDataRequirements']} })
    library_source: Optional[list[LibrarySource]] = Field(default=None, description="""The library source values that discovered runs may have.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedDiscovery', 'WorkflowDataRequirements']} })
    instrument_platform: Optional[list[str]] = Field(default=None, description="""The instrument platforms that discovered runs may have (e.g., 'ILLUMINA').""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedDiscovery']} })
    first_public_from: Optional[str] = Field(default=None, description="""Only runs first made public on or after this date (YYYY-MM-DD) are discovered.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedDiscovery']} })

    @field_validator('first_public_from')
    def pattern_first_public_from(cls, v):
        pattern=re.compile(r"^\d{4}-\d{2}-\d{2}$")
        if isinstance(v, list):
            for element in v:
                if isinstance(element, str) and not pattern.search(element):
                    err_msg = f"Invalid first_public_from format: {element}"
                    raise ValueError(err_msg)
        elif isinstance(v, str) and not pattern.search(v):
            err_msg = f"Invalid first_public_from format: {v}"
            raise ValueError(err_msg)
        return v


class PrecomputedRelease(ConfiguredBaseModel):
    """
    Details of a published set of pre-computed results.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/outbreaks.yaml#'})

    manifest_url: str = Field(default=..., description="""Location of the manifest describing the published results, as a path relative to the configured release base URL, or a complete URL (including http/https protocol) where the results are hosted elsewhere.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedRelease']} })
    last_updated: str = Field(default=..., description="""The date (YYYY-MM-DD) the results were last updated.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedRelease']} })
    record_count: Optional[int] = Field(default=None, description="""The number of records in the published results.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedRelease']} })

    @field_validator('last_updated')
    def pattern_last_updated(cls, v):
        pattern=re.compile(r"^\d{4}-\d{2}-\d{2}$")
        if isinstance(v, list):
            for element in v:
                if isinstance(element, str) and not pattern.search(element):
                    err_msg = f"Invalid last_updated format: {element}"
                    raise ValueError(err_msg)
        elif isinstance(v, str) and not pattern.search(v):
            err_msg = f"Invalid last_updated format: {v}"
            raise ValueError(err_msg)
        return v


class OutbreakResource(ConfiguredBaseModel):
    """
    Definition of an external resource (reference, tool, database) associated with a priority pathogen.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/outbreaks.yaml#'})

    url: str = Field(default=..., description="""The complete URL (including http/https protocol) to the external resource.""", json_schema_extra = { "linkml_meta": {'domain_of': ['OutbreakResource', 'WorkflowUrlSpec']} })
    title: str = Field(default=..., description="""The display title for the resource link as it will appear in the BRC Analytics interface.""", json_schema_extra = { "linkml_meta": {'domain_of': ['OutbreakResource']} })
    type: OutbreakResourceType = Field(default=..., description="""The category or type of the resource (e.g., REFERENCE, TOOL, DATABASE), which determines how it is displayed and organized.""", json_schema_extra = { "linkml_meta": {'domain_of': ['OutbreakResource']} })


class MarkdownFileReference(ConfiguredBaseModel):
    """
    A reference to a markdown file containing detailed content about a priority pathogen.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/outbreaks.yaml#'})

    path: str = Field(default=..., description="""Relative path to the markdown file from the project root. Must end with .md extension.""", json_schema_extra = { "linkml_meta": {'domain_of': ['MarkdownFileReference']} })

    @field_validator('path')
    def pattern_path(cls, v):
        pattern=re.compile(r".*\.md$")
        if isinstance(v, list):
            for element in v:
                if isinstance(element, str) and not pattern.search(element):
                    err_msg = f"Invalid path format: {element}"
                    raise ValueError(err_msg)
        elif isinstance(v, str) and not pattern.search(v):
            err_msg = f"Invalid path format: {v}"
            raise ValueError(err_msg)
        return v


class Pangenomes(ConfiguredBaseModel):
    """
    Root object containing a collection of pangenome definitions for the BRC Analytics platform.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/pangenomes.yaml#',
         'tree_root': True})

    pangenomes: list[Pangenome] = Field(default=..., description="""Collection of pangenome entries that will be available in the BRC Analytics platform.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Pangenomes']} })


class Pangenome(ConfiguredBaseModel):
    """
    Definition of a pangenome with its unique identifier.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/pangenomes.yaml#'})

    id: str = Field(default=..., description="""The unique identifier for the pangenome.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Pangenome']} })


class PrecomputedResultsDataset(ConfiguredBaseModel):
    """
    Root object containing a collection of precomputed sequence analysis results.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/precomputed_results.yaml#',
         'tree_root': True})

    results: list[PrecomputedResult] = Field(default=..., description="""Collection of precomputed results, one per analyzed sequence.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResultsDataset']} })


class PrecomputedResult(ConfiguredBaseModel):
    """
    Precomputed analysis result for a single sequence, including its segmentation, coordinate barcode intervals, and the provenance of the workflow that produced it.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/precomputed_results.yaml#'})

    sequence_id: str = Field(default=..., description="""Identifier of the analyzed sequence.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResult']} })
    structural_formula: str = Field(default=..., description="""Compact string representation of the sequence's structural composition.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResult']} })
    coordinate_barcode: str = Field(default=..., description="""String encoding of the sequence's coordinate barcode.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResult']} })
    compendium_match: CompendiumMatch = Field(default=..., description="""The degree to which the sequence matches an entry in the reference compendium.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResult']} })
    segments: Optional[list[SegmentAlignment]] = Field(default=None, description="""List of segment alignments describing how regions of the sequence align to reference segments.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResult']} })
    breakpoints: Optional[list[BarcodeInterval]] = Field(default=None, description="""List of coordinate barcode intervals representing candidate breakpoints and their statistical support.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResult']} })
    provenance: WorkflowProvenance = Field(default=..., description="""Provenance of the workflow invocation that produced this result.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResult']} })


class SegmentAlignment(ConfiguredBaseModel):
    """
    Alignment of a sequence segment against a reference, with lineage assignment and alignment quality metrics.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/precomputed_results.yaml#'})

    segment_key: str = Field(default=..., description="""Identifier of the reference segment this alignment corresponds to.""", json_schema_extra = { "linkml_meta": {'domain_of': ['SegmentAlignment']} })
    start: int = Field(default=..., description="""Start coordinate of the aligned region (1-based, inclusive).""", json_schema_extra = { "linkml_meta": {'domain_of': ['SegmentAlignment']} })
    end: int = Field(default=..., description="""End coordinate of the aligned region (1-based, inclusive).""", json_schema_extra = { "linkml_meta": {'domain_of': ['SegmentAlignment']} })
    lineage_id: Optional[str] = Field(default=None, description="""Identifier of the lineage assigned to this segment.""", json_schema_extra = { "linkml_meta": {'domain_of': ['SegmentAlignment']} })
    identity: Optional[float] = Field(default=None, description="""Fraction of aligned positions that are identical to the reference (0.0-1.0).""", json_schema_extra = { "linkml_meta": {'domain_of': ['SegmentAlignment']} })
    coverage: Optional[float] = Field(default=None, description="""Fraction of the reference segment covered by the alignment (0.0-1.0).""", json_schema_extra = { "linkml_meta": {'domain_of': ['SegmentAlignment']} })


class BarcodeInterval(ConfiguredBaseModel):
    """
    A coordinate barcode interval with its confidence bounds and the 2x2 contingency statistics supporting it.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/precomputed_results.yaml#'})

    position: int = Field(default=..., description="""Genomic position of the interval or breakpoint.""", json_schema_extra = { "linkml_meta": {'domain_of': ['BarcodeInterval']} })
    ci_low: Optional[int] = Field(default=None, description="""Lower bound of the confidence interval for the position.""", json_schema_extra = { "linkml_meta": {'domain_of': ['BarcodeInterval']} })
    ci_high: Optional[int] = Field(default=None, description="""Upper bound of the confidence interval for the position.""", json_schema_extra = { "linkml_meta": {'domain_of': ['BarcodeInterval']} })
    p_fisher: Optional[float] = Field(default=None, description="""P-value from Fisher's exact test on the supporting 2x2 contingency table.""", json_schema_extra = { "linkml_meta": {'domain_of': ['BarcodeInterval']} })
    n11: Optional[int] = Field(default=None, description="""Count in cell (1,1) of the 2x2 contingency table.""", json_schema_extra = { "linkml_meta": {'domain_of': ['BarcodeInterval']} })
    n12: Optional[int] = Field(default=None, description="""Count in cell (1,2) of the 2x2 contingency table.""", json_schema_extra = { "linkml_meta": {'domain_of': ['BarcodeInterval']} })
    n21: Optional[int] = Field(default=None, description="""Count in cell (2,1) of the 2x2 contingency table.""", json_schema_extra = { "linkml_meta": {'domain_of': ['BarcodeInterval']} })
    n22: Optional[int] = Field(default=None, description="""Count in cell (2,2) of the 2x2 contingency table.""", json_schema_extra = { "linkml_meta": {'domain_of': ['BarcodeInterval']} })


class WorkflowProvenance(ConfiguredBaseModel):
    """
    Provenance identifying the workflow and tool invocation that produced a precomputed result.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/precomputed_results.yaml#'})

    workflow_trs_id: str = Field(default=..., description="""Tool Registry Service (TRS) identifier of the workflow.""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedResults', 'WorkflowProvenance']} })
    workflow_version: str = Field(default=..., description="""Version of the workflow that was invoked.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowProvenance']} })
    invocation_id: str = Field(default=..., description="""Identifier of the specific workflow invocation that produced the result.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowProvenance']} })
    tool_version: Optional[str] = Field(default=None, description="""Version of the underlying tool used within the workflow.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowProvenance']} })


class Taxa(ConfiguredBaseModel):
    """
    Root object containing a collection of curated taxon entries for the BRC Analytics platform.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/taxa.yaml#',
         'tree_root': True})

    taxa: list[Taxon] = Field(default=..., description="""Collection of taxon entries supplying curated information that supplements NCBI's taxonomic data.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Taxa']} })


class Taxon(ConfiguredBaseModel):
    """
    Curated information about a taxon, identified by NCBI Taxonomy ID. Curated values apply to the identified taxon alone; they reach an assembly when the taxon is the assembly's own taxon or one of its ancestors up to rank 'species', and reach an organism when they reach any of that organism's assemblies. A taxon above species rank therefore has no effect on assemblies.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/taxa.yaml#'})

    taxonomy_id: int = Field(default=..., description="""An NCBI Taxonomy ID at any rank. In particular, this may be an infraspecific taxon, which `Organism.taxonomy_id` cannot express; SARS-CoV-2 (2697049) is the motivating case, sitting below its species in NCBI's taxonomy while the catalog's organism is the species.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Organism',
                       'Outbreak',
                       'PrecomputedDiscovery',
                       'Taxon',
                       'Workflow']} })
    other_names: list[str] = Field(default=..., description="""Curated alternative names for the taxon, such as abbreviations and colloquial names that NCBI doesn't supply. Merged into the taxon's NCBI-derived other names in the built catalog. Should be given as display forms; consumers are responsible for normalizing case and punctuation as appropriate.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Taxon']} })


class WorkflowCategories(ConfiguredBaseModel):
    """
    Root object containing a collection of workflow category definitions used to organize workflows in the BRC Analytics platform.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/workflow_categories.yaml#',
         'tree_root': True})

    workflow_categories: list[WorkflowCategory] = Field(default=..., description="""Collection of workflow category entries that will be used to group and organize workflows in the BRC Analytics interface.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowCategories']} })


class WorkflowCategory(ConfiguredBaseModel):
    """
    Definition of a workflow category used to group related workflows for organization and display purposes.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/workflow_categories.yaml#'})

    category: WorkflowCategoryId = Field(default=..., description="""The unique identifier for the workflow category, used to link workflows to their respective categories.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowCategory']} })
    name: str = Field(default=..., description="""The human-readable display name of the workflow category as it will appear in the BRC Analytics interface.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak', 'WorkflowCategory', 'WorkflowCollectionSpec']} })
    description: str = Field(default=..., description="""A detailed description of the workflow category explaining its purpose and the types of workflows it contains.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak', 'WorkflowCategory', 'WorkflowDataRequirements']} })
    show_coming_soon: bool = Field(default=..., description="""Boolean flag that determines whether to display a 'Coming Soon' indicator for this category in the BRC Analytics interface when workflows in this category are not yet available.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowCategory']} })


class Workflows(ConfiguredBaseModel):
    """
    Root object containing a collection of Galaxy workflow definitions for the BRC Analytics platform.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/workflows.yaml#',
         'tree_root': True})

    workflows: list[Workflow] = Field(default=..., description="""Collection of workflow entries that will be available to users in the BRC Analytics platform.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflows']} })


class Workflow(ConfiguredBaseModel):
    """
    Definition of a Galaxy workflow with its metadata, parameters, and organism compatibility information.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/workflows.yaml#'})

    trs_id: str = Field(default=..., description="""The Tool Repository Service (TRS) identifier for the workflow, used to locate and retrieve the workflow from a Galaxy server.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflow']} })
    categories: list[WorkflowCategoryId] = Field(default=..., description="""List of category identifiers that this workflow belongs to, determining how it is organized and displayed in the BRC Analytics interface.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflow']} })
    workflow_name: str = Field(default=..., description="""The human-readable display name of the workflow as it will appear in the BRC Analytics interface.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflow']} })
    workflow_description: str = Field(default=..., description="""A detailed description of the workflow's purpose, functionality, and expected outputs for users.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflow']} })
    ploidy: WorkflowPloidy = Field(default=..., description="""The ploidy state (number of chromosome sets) that this workflow is designed to work with, ensuring compatibility with organism data.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Organism', 'Workflow']} })
    scope: Optional[WorkflowScope] = Field(default=None, description="""The scope level at which this workflow operates, determining where it is displayed in the UI and what the first configuration step should be. Defaults to ASSEMBLY for backward compatibility.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflow']} })
    assembly_count_min: Optional[int] = Field(default=None, description="""The minimum number of genome assemblies a user must select for this workflow. Defaults to 1 for ASSEMBLY-scope workflows; must be set explicitly for ORGANISM and SEQUENCE scope. Use 0 for workflows that take no user-selected assemblies (e.g. assembly-building or curated-FASTA workflows).""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflow']} })
    assembly_count_max: Optional[int] = Field(default=None, description="""The maximum number of genome assemblies a user may select for this workflow. Null/absent means no upper limit. Defaults to 1 for ASSEMBLY-scope workflows; must be set explicitly for ORGANISM and SEQUENCE scope.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflow']} })
    taxonomy_id: Optional[int] = Field(default=None, description="""The NCBI Taxonomy ID of the organism this workflow is designed for. If specified, the workflow will be available for all assemblies with this ID in their taxonomic lineage.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Organism',
                       'Outbreak',
                       'PrecomputedDiscovery',
                       'Taxon',
                       'Workflow']} })
    parameters: list[WorkflowParameter] = Field(default=..., description="""Collection of input parameters that will be passed to the workflow when it is executed, including data sources and configuration options.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflow']} })
    active: bool = Field(default=..., description="""Boolean flag that determines if the workflow should be included in the BRC Analytics interface. Used to manage visibility of workflows that may be under development or deprecated.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak', 'Workflow']} })
    iwc_id: str = Field(default=..., description="""The Intergalactic Workflow Commission (IWC) identifier for the workflow, used to link to the workflow's page on the IWC website.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Workflow']} })


class WorkflowDataRequirements(ConfiguredBaseModel):
    """
    Specification of data requirements for a workflow parameter, such as library strategy and layout.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/workflows.yaml#'})

    library_strategy: Optional[list[LibraryStrategy]] = Field(default=None, description="""The library strategy values that are acceptable for this parameter (e.g., 'WGS', 'RNA-Seq').""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedDiscovery', 'WorkflowDataRequirements']} })
    library_layout: Optional[LibraryLayout] = Field(default=None, description="""The library layout that is required for this parameter (e.g., 'PAIRED', 'SINGLE').""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedDiscovery', 'WorkflowDataRequirements']} })
    library_source: Optional[list[LibrarySource]] = Field(default=None, description="""The library source values that are acceptable for this parameter (e.g., 'GENOMIC', 'TRANSCRIPTOMIC SINGLE CELL').""", json_schema_extra = { "linkml_meta": {'domain_of': ['PrecomputedDiscovery', 'WorkflowDataRequirements']} })
    description: Optional[str] = Field(default=None, description="""A descriptive text to provide additional context about the data requirements, useful for non-standard library strategies like 'OTHER'.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak', 'WorkflowCategory', 'WorkflowDataRequirements']} })


class WorkflowCollectionSpec(ConfiguredBaseModel):
    """
    Definition of a collection-based data source for a workflow parameter, allowing multiple files to be grouped into a Galaxy collection.

    Example usage for hard-coded FASTA references:
    ```yaml
    collection_spec:
      collection_type: list
      name: Influenza Segment References
      elements:
        - ext: fasta
          src: url
          url: https://zenodo.org/record/123/files/segment1.fasta
          md5: abc123...
        - ext: fasta
          src: url
          url: https://zenodo.org/record/123/files/segment2.fasta
          md5: def456...
    ```
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/workflows.yaml#'})

    collection_type: CollectionType = Field(default=..., description="""The type of Galaxy collection to create. Currently only 'list' is supported. Determines the structure of the collection.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowCollectionSpec']} })
    elements: list[WorkflowUrlSpec] = Field(default=..., description="""Array of URL specifications that will become elements in the collection. Each element represents a file to include in the collection. Must contain at least one element.""", min_length=1, json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowCollectionSpec']} })
    name: Optional[str] = Field(default=None, description="""Optional identifier for the collection, used as the collection name in Galaxy. If not provided, defaults to 'Collection'.""", json_schema_extra = { "linkml_meta": {'domain_of': ['Outbreak', 'WorkflowCategory', 'WorkflowCollectionSpec']} })


class WorkflowParameter(ConfiguredBaseModel):
    """
    Definition of an input parameter for a Galaxy workflow, specifying how the parameter value should be determined when the workflow is executed.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/workflows.yaml#'})

    key: str = Field(default=..., description="""The identifier for the parameter as expected by the Galaxy workflow, used to map the parameter value to the correct input.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowParameter']} })
    variable: Optional[WorkflowParameterVariable] = Field(default=None, description="""A predefined variable that will be substituted as the value of the parameter at runtime, such as assembly information.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowParameter']} })
    collection_spec: Optional[WorkflowCollectionSpec] = Field(default=None, description="""A collection specification for the parameter, allowing multiple files from external sources to be provided as a Galaxy collection.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowParameter']} })
    url_spec: Optional[WorkflowUrlSpec] = Field(default=None, description="""A direct URL specification for the parameter, allowing for external data sources to be provided to the workflow.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowParameter']} })
    data_requirements: Optional[WorkflowDataRequirements] = Field(default=None, description="""Specifications for the data requirements of this parameter, such as library strategy and layout.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowParameter']} })
    type_guide: Optional[Any] = Field(default=None, description="""Arbitrary data describing the expected type and format of the parameter, intended as a reference for catalog maintainers and not used in workflow execution.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowParameter']} })


class WorkflowUrlSpec(ConfiguredBaseModel):
    """
    Definition of a URL-based data source for a workflow parameter, typically used for reference data or external resources.
    """
    linkml_meta: ClassVar[LinkMLMeta] = LinkMLMeta({'from_schema': 'https://github.com/galaxyproject/brc-analytics/blob/main/catalog/py_package/catalog_build/schema/workflows.yaml#'})

    ext: str = Field(default=..., description="""The file extension of the resource at the URL, which determines how Galaxy will interpret the data (e.g., 'fasta', 'gff', 'tabular').""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowUrlSpec']} })
    src: str = Field(default=..., description="""The source type for the parameter, typically 'url' to indicate an external URL source rather than a Galaxy dataset or other source type.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowUrlSpec']} })
    url: str = Field(default=..., description="""The complete URL (including http/https protocol) to the external resource that will be used as input to the workflow.""", json_schema_extra = { "linkml_meta": {'domain_of': ['OutbreakResource', 'WorkflowUrlSpec']} })
    db_key: Optional[str] = Field(default=None, description="""Optional database key (genome build) to associate with this file, used by Galaxy to link the file to a specific reference genome.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowUrlSpec']} })
    md5: Optional[str] = Field(default=None, description="""Optional MD5 checksum hash for file integrity verification.""", json_schema_extra = { "linkml_meta": {'domain_of': ['WorkflowUrlSpec']} })


# Model rebuild
# see https://pydantic-docs.helpmanual.io/usage/models/#rebuilding-a-model
Assemblies.model_rebuild()
Assembly.model_rebuild()
Organisms.model_rebuild()
Organism.model_rebuild()
Outbreaks.model_rebuild()
Outbreak.model_rebuild()
PrecomputedResults.model_rebuild()
PrecomputedDiscovery.model_rebuild()
PrecomputedRelease.model_rebuild()
OutbreakResource.model_rebuild()
MarkdownFileReference.model_rebuild()
Pangenomes.model_rebuild()
Pangenome.model_rebuild()
PrecomputedResultsDataset.model_rebuild()
PrecomputedResult.model_rebuild()
SegmentAlignment.model_rebuild()
BarcodeInterval.model_rebuild()
WorkflowProvenance.model_rebuild()
Taxa.model_rebuild()
Taxon.model_rebuild()
WorkflowCategories.model_rebuild()
WorkflowCategory.model_rebuild()
Workflows.model_rebuild()
Workflow.model_rebuild()
WorkflowDataRequirements.model_rebuild()
WorkflowCollectionSpec.model_rebuild()
WorkflowParameter.model_rebuild()
WorkflowUrlSpec.model_rebuild()

