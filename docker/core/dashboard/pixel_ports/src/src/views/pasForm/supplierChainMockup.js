// ejemplo de supplierChain hasta que este lista la parte servidora.

export const supplierChainMockup = [
  {
    'ID': 'SC_unknown',
    'label': "SC_unknown's name",
    'comment': "SC_unknown's comment",
    'compatibility': {
      'cargoes_category': [
        'unknown'
      ],
      'directions_nature': [
        'loading',
        'unloading'
      ],
      'areas_ID': [
        '413',
        '414',
        '415',
        '416',
        '417',
        '430',
        '431',
        '432',
        '433',
        '434',
        '435',
        '436',
        '449'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Initialization',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'delay',
            'value': 20
          }
        },
        'work': {
          'machines': [
            'machine_1'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_E.CONTENEURS',
    'label': "SC_E.CONTENEURS's name",
    'comment': "SC_E.CONTENEURS's comment",
    'compatibility': {
      'cargoes_category': [
        'E.CONTENEURS'
      ],
      'directions_nature': [
        'loading'
      ],
      'areas_ID': [
        '432'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Initialization',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'delay',
            'value': 20
          }
        },
        'work': {
          'machines': [
            'machine_1'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_1'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_19'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_E.FERRAIL.REFONT.',
    'label': "SC_E.FERRAIL.REFONT.'s name",
    'comment': "SC_E.FERRAIL.REFONT.'s comment",
    'compatibility': {
      'cargoes_category': [
        'E.FERRAIL.REFONT.'
      ],
      'directions_nature': [
        'loading'
      ],
      'areas_ID': [
        '414'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_1'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_2'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'with_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_20'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_E.HUILE%20TOURNESOL',
    'label': "SC_E.HUILE%20TOURNESOL's name",
    'comment': "SC_E.HUILE%20TOURNESOL's comment",
    'compatibility': {
      'cargoes_category': [
        'E.HUILE%20TOURNESOL'
      ],
      'directions_nature': [
        'loading'
      ],
      'areas_ID': [
        '436'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Initialization',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_3'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_34'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_E.HUILES%20MIXTES',
    'label': "SC_E.HUILES%20MIXTES's name",
    'comment': "SC_E.HUILES%20MIXTES's comment",
    'compatibility': {
      'cargoes_category': [
        'E.HUILES%20MIXTES'
      ],
      'directions_nature': [
        'loading'
      ],
      'areas_ID': [
        '436'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_all',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_4'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'with_all',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_22'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_E.MAIS%20VRAC',
    'label': "SC_E.MAIS%20VRAC's name",
    'comment': "SC_E.MAIS%20VRAC's comment",
    'compatibility': {
      'cargoes_category': [
        'E.MAIS%20VRAC'
      ],
      'directions_nature': [
        'loading'
      ],
      'areas_ID': [
        '449, 417'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_5'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'with_all',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_23'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.BOIS%20SCIES%20DU%20NORD',
    'label': "SC_I.BOIS%20SCIES%20DU%20NORD's name",
    'comment': "SC_I.BOIS%20SCIES%20DU%20NORD's comment",
    'compatibility': {
      'cargoes_category': [
        'I.BOIS%20SCIES%20DU%20NORD'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '417, 413, 415'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_all',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_6'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_24'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.BUTADIENE',
    'label': "SC_I.BUTADIENE's name",
    'comment': "SC_I.BUTADIENE's comment",
    'compatibility': {
      'cargoes_category': [
        'I.BUTADIENE'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '436'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Initialization',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'delay',
            'value': 45
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_7'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_25'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.CHARBON',
    'label': "SC_I.CHARBON's name",
    'comment': "SC_I.CHARBON's comment",
    'compatibility': {
      'cargoes_category': [
        'I.CHARBON'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '435, 434'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_8'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'with_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_26'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.CLINKER',
    'label': "SC_I.CLINKER's name",
    'comment': "SC_I.CLINKER's comment",
    'compatibility': {
      'cargoes_category': [
        'I.CLINKER'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '416, 431'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Initialization',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_9'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_27'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.CONTENEURS',
    'label': "SC_I.CONTENEURS's name",
    'comment': "SC_I.CONTENEURS's comment",
    'compatibility': {
      'cargoes_category': [
        'I.CONTENEURS'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '432'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_all',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_10'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'with_all',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_28'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.EMHV%20-%20EMAG%20-%20FAME',
    'label': "SC_I.EMHV%20-%20EMAG%20-%20FAME's name",
    'comment': "SC_I.EMHV%20-%20EMAG%20-%20FAME's comment",
    'compatibility': {
      'cargoes_category': [
        'I.EMHV%20-%20EMAG%20-%20FAME'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '436'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Initialization',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'delay',
            'value': 15
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_11'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_35'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.METHANOL',
    'label': "SC_I.METHANOL's name",
    'comment': "SC_I.METHANOL's comment",
    'compatibility': {
      'cargoes_category': [
        'I.METHANOL'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '436'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_12'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_30'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.TALL-OIL',
    'label': "SC_I.TALL-OIL's name",
    'comment': "SC_I.TALL-OIL's comment",
    'compatibility': {
      'cargoes_category': [
        'I.TALL-OIL'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '436'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_7'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_all',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_13'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'with_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_31'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.TOURNESOL%20VRAC',
    'label': "SC_I.TOURNESOL%20VRAC's name",
    'comment': "SC_I.TOURNESOL%20VRAC's comment",
    'compatibility': {
      'cargoes_category': [
        'I.TOURNESOL%20VRAC'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '431, 433, 434'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Initialization',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_33'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_14'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_32'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  },
  {
    'ID': 'SC_I.UREE%20VRAC',
    'label': "SC_I.UREE%20VRAC's name",
    'comment': "SC_I.UREE%20VRAC's comment",
    'compatibility': {
      'cargoes_category': [
        'I.UREE%20VRAC'
      ],
      'directions_nature': [
        'unloading'
      ],
      'areas_ID': [
        '433'
      ],
      'shiftworks_ID': [
        'typical'
      ]
    },
    'steps_list': [
      {
        'ID': 'step_1',
        'label': "step_1's name",
        'comment': "step_1's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'delay',
            'value': 0
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_17'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_2',
        'label': "step_2's name",
        'comment': "step_2's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': 'step_1'
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_15'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      },
      {
        'ID': 'step_3',
        'label': "step_3's name",
        'comment': "step_3's comment",
        'category': 'Processing',
        'scheduling': {
          'start': {
            'nature': 'after_any',
            'value': [
              'step_1',
              'step_2'
            ]
          },
          'duration': {
            'nature': 'cargo_%',
            'value': 100
          }
        },
        'work': {
          'machines': [
            'machine_33'
          ],
          'nature': 'parallel',
          'distance': 'on_spot'
        }
      }
    ]
  }
]