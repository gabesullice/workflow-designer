flowchart LR
    classDef default fill:transparent,stroke:#333,stroke-width:2px,font-weight:600
    draft draft-published-inaccessible@-.->|Publish| published
    review review-published-inaccessible@-.->|Publish| published
    draft(Draft)
    review(In Review)
    published(Published)